import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import * as argon2 from "argon2";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

async function hashPassword(password: string) {
  return await argon2.hash(password);
}

async function verifyPassword(supplied: string, stored: string) {
  try {
    if (!stored) {
      console.error("Senha armazenada é inválida");
      return false;
    }
    
    return await argon2.verify(stored, supplied);
  } catch (error) {
    console.error("Erro ao verificar senha:", error);
    return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "visaomais-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: 'username' },
      async (username, password, done) => {
        try {
          console.log(`Tentativa de login com: ${username}`);
          
          // Primeiro tenta por email, depois por username
          let user = await storage.getUserByEmail(username);
          if (!user) {
            user = await storage.getUserByUsername(username);
          }
          
          if (!user) {
            console.log(`Usuário não encontrado: ${username}`);
            return done(null, false);
          }
          
          console.log(`Usuário encontrado: ${user.username} (${user.email})`);
          
          // Verificação de senha usando argon2
          const isValidPassword = await verifyPassword(password, user.password);
          if (!isValidPassword) {
            console.log(`Senha inválida para: ${username}`);
            return done(null, false);
          }
          
          console.log(`Login bem-sucedido para: ${user.email || user.username}`);
          return done(null, user);
        } catch (error) {
          console.error("Erro durante autenticação:", error);
          return done(error);
        }
      }
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Register route - Only clients can self-register
  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Nome de usuário já existe");
      }

      // Ensure only clients can register directly
      if (req.body.user_type !== "client") {
        req.body.user_type = "client";
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao fazer login" });
        }
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  // Logout route
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // Get current user
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Register a franchise - Requires admin approval later
  app.post("/api/register-franchise", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).send("Autenticação necessária");
      }

      // Create a franchisee user
      const franchiseeData = {
        username: req.body.email,
        password: await hashPassword(req.body.password),
        name: req.body.ownerName,
        phone: req.body.phone,
        user_type: "franchisee",
        status: "pending" // Pending admin approval
      };
      
      const franchisee = await storage.createUser(franchiseeData);

      // Create the franchise
      const franchise = await storage.createFranchise({
        name: req.body.franchiseName,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone,
        owner_id: franchisee.id,
        status: "pending" // Pending admin approval
      });

      res.status(201).json({
        message: "Solicitação de franquia enviada com sucesso. Aguardando aprovação do administrador.",
        franchise
      });
    } catch (error) {
      next(error);
    }
  });

  // Approve franchise - Admin only
  app.post("/api/approve-franchise/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || req.user.user_type !== "admin") {
        return res.status(403).send("Acesso não autorizado");
      }

      const franchiseId = parseInt(req.params.id);
      const franchise = await storage.approveFranchise(franchiseId);
      
      // Also approve the franchisee user
      const franchiseeId = franchise.owner_id;
      await storage.approveUser(franchiseeId);

      res.status(200).json({
        message: "Franquia aprovada com sucesso",
        franchise
      });
    } catch (error) {
      next(error);
    }
  });

  // Reject franchise - Admin only
  app.post("/api/reject-franchise/:id", async (req, res, next) => {
    try {
      if (!req.isAuthenticated() || req.user.user_type !== "admin") {
        return res.status(403).send("Acesso não autorizado");
      }

      const franchiseId = parseInt(req.params.id);
      const franchise = await storage.rejectFranchise(franchiseId);
      
      // Also reject the franchisee user
      const franchiseeId = franchise.owner_id;
      await storage.rejectUser(franchiseeId);

      res.status(200).json({
        message: "Franquia rejeitada",
        franchise
      });
    } catch (error) {
      next(error);
    }
  });
}
