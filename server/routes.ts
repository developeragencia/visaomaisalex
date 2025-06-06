import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import argon2 from "argon2";
import { 
  insertUserSchema, insertFranchiseSchema, insertPlanSchema, insertProductSchema,
  insertInventorySchema, insertAppointmentSchema, insertMeasurementSchema,
  insertFranchiseApplicationSchema, insertSupportTicketSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import opticalMeasurementRouter from './optical-measurement-endpoint';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Middleware para autenticação
  app.use((req, res, next) => {
    console.log("Auth middleware - User:", req.user);
    console.log("Auth middleware - Session:", req.session);
    next();
  });
  
  // Appointments routes - Full CRUD
  app.get("/api/appointments", async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Buscar appointments do usuário logado
      const appointments = await storage.getAppointmentsByUserId(req.user.id);
      console.log("Fetched appointments for user", req.user.id, ":", appointments);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointment(Number(req.params.id));
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch appointment" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    console.log("=== APPOINTMENT POST REQUEST RECEIVED ===");
    console.log("Body:", req.body);
    console.log("User:", req.user);
    
    try {
      if (!req.user) {
        console.log("ERROR: No user in request");
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      console.log("USER ID:", req.user.id);
      console.log("FRANCHISE ID:", req.body.franchise_id || 1);
      
      // Preparar dados do appointment
      const appointmentData = {
        appointment_date: new Date(req.body.date),
        service_type: req.body.appointment_type,
        user_id: req.user.id,
        franchise_id: req.body.franchise_id || 1,
        status: req.body.status || 'scheduled',
        notes: req.body.notes || null
      };

      console.log("=== SENDING TO STORAGE ===", appointmentData);

      const appointment = await storage.createAppointment(appointmentData);
      console.log("=== SUCCESS ===", appointment);
      
      res.status(201).json(appointment);
    } catch (error) {
      console.error("DETAILED Error creating appointment:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');
      res.status(500).json({ 
        error: "Failed to create appointment", 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack'
      });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.updateAppointment(Number(req.params.id), req.body);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAppointment(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete appointment" });
    }
  });

  // Products routes - Full CRUD
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(Number(req.params.id), req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/measurements/:id", async (req, res) => {
    try {
      const measurement = await storage.getMeasurement(Number(req.params.id));
      if (!measurement) {
        return res.status(404).json({ error: "Measurement not found" });
      }
      res.json(measurement);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch measurement" });
    }
  });

  app.post("/api/measurements", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const measurementData = {
        ...req.body,
        user_id: Number(userId),
        measured_by: Number(userId)
      };

      const measurement = await storage.createMeasurement(measurementData);
      res.json(measurement);
    } catch (error) {
      console.error("Error creating measurement:", error);
      res.status(500).json({ error: "Failed to create measurement" });
    }
  });

  app.put("/api/measurements/:id", async (req, res) => {
    try {
      const measurement = await storage.updateMeasurement(Number(req.params.id), req.body);
      if (!measurement) {
        return res.status(404).json({ error: "Measurement not found" });
      }
      res.json(measurement);
    } catch (error) {
      res.status(500).json({ error: "Failed to update measurement" });
    }
  });

  app.delete("/api/measurements/:id", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      await storage.deleteMeasurement(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting measurement:", error);
      res.status(500).json({ error: "Failed to delete measurement" });
    }
  });

  // Franchises routes - Full CRUD
  app.get("/api/franchises", async (req, res) => {
    try {
      const franchises = await storage.getAllFranchises();
      res.json(franchises);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch franchises" });
    }
  });

  app.get("/api/franchises/:id", async (req, res) => {
    try {
      const franchise = await storage.getFranchise(Number(req.params.id));
      if (!franchise) {
        return res.status(404).json({ error: "Franchise not found" });
      }
      res.json(franchise);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch franchise" });
    }
  });

  app.post("/api/franchises", async (req, res) => {
    try {
      const franchise = await storage.createFranchise(req.body);
      res.json(franchise);
    } catch (error) {
      res.status(500).json({ error: "Failed to create franchise" });
    }
  });

  app.put("/api/franchises/:id", async (req, res) => {
    try {
      const franchise = await storage.updateFranchise(Number(req.params.id), req.body);
      if (!franchise) {
        return res.status(404).json({ error: "Franchise not found" });
      }
      res.json(franchise);
    } catch (error) {
      res.status(500).json({ error: "Failed to update franchise" });
    }
  });

  app.delete("/api/franchises/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFranchise(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "Franchise not found" });
      }
      res.json({ message: "Franchise deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete franchise" });
    }
  });

  // Users routes - Full CRUD
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      // Hash da senha padrão se não fornecida
      const userData = {
        ...req.body,
        password: req.body.password ? await argon2.hash(req.body.password) : await argon2.hash('123456'),
        status: 'active'
      };
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(Number(req.params.id), req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteUser(Number(req.params.id));
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // User plans routes
  app.get("/api/user-plans", async (req, res) => {
    try {
      const { userId } = req.query;
      if (userId) {
        const userPlan = await storage.getUserPlan(Number(userId));
        res.json(userPlan);
      } else {
        res.status(400).json({ error: "userId is required" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user plan" });
    }
  });

  // Measurements routes
  app.get("/api/measurements", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const measurements = await storage.getMeasurementsByUserId(Number(userId));
      res.json(measurements);
    } catch (error) {
      console.error("Error fetching measurements:", error);
      res.status(500).json({ error: "Failed to fetch measurements" });
    }
  });

  // Endpoint para processamento de medição óptica (sem autenticação necessária)
  app.post("/api/process-measurement", async (req, res) => {
    try {
      console.log("Recebendo solicitação de processamento de medição...");
      const { image, calibrationHint } = req.body;
      
      if (!image) {
        console.log("Erro: Imagem não fornecida");
        return res.status(400).json({ error: "Image data is required" });
      }

      console.log("Importando engine de medição óptica...");
      const { opticalEngine } = await import("./optical-measurement-engine");
      
      console.log("Processando medição com engine...");
      const measurements = await opticalEngine.measureOpticalParameters(
        image,
        calibrationHint
      );
      
      console.log("Medições processadas:", measurements);
      res.json(measurements);
    } catch (error) {
      console.error("Error processing optical measurement:", error);
      res.status(500).json({ 
        error: "Failed to process optical measurement",
        details: error.message 
      });
    }
  });

  app.post("/api/measurements", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const measurementData = {
        ...req.body,
        user_id: Number(userId),
        measured_by: Number(userId)
      };

      const measurement = await storage.createMeasurement(measurementData);
      res.json(measurement);
    } catch (error) {
      console.error("Error creating measurement:", error);
      res.status(500).json({ error: "Failed to create measurement" });
    }
  });

  // Users routes (for admin)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Plans routes
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch plans" });
    }
  });
  // Autenticação já configurada no index.ts

  // API para franquias
  app.get("/api/franchises", async (req, res) => {
    try {
      const franchises = await storage.getAllFranchises();
      res.json(franchises);
    } catch (error) {
      console.error("Erro ao buscar franquias:", error);
      res.status(500).json({ error: "Erro ao buscar franquias" });
    }
  });

  app.get("/api/franchises/pending", async (req, res) => {
    try {
      const franchises = await storage.getPendingFranchises();
      res.json(franchises);
    } catch (error) {
      console.error("Erro ao buscar franquias pendentes:", error);
      res.status(500).json({ error: "Erro ao buscar franquias pendentes" });
    }
  });

  app.post("/api/franchises", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const franchise = await storage.createFranchise(req.body);
      res.status(201).json(franchise);
    } catch (error) {
      console.error("Erro ao criar franquia:", error);
      res.status(500).json({ error: "Erro ao criar franquia" });
    }
  });

  app.post("/api/franchises/:id/approve", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const franchise = await storage.approveFranchise(parseInt(req.params.id));
      if (!franchise) {
        return res.status(404).json({ error: "Franquia não encontrada" });
      }
      res.json(franchise);
    } catch (error) {
      console.error("Erro ao aprovar franquia:", error);
      res.status(500).json({ error: "Erro ao aprovar franquia" });
    }
  });

  app.post("/api/franchises/:id/reject", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const franchise = await storage.rejectFranchise(parseInt(req.params.id));
      if (!franchise) {
        return res.status(404).json({ error: "Franquia não encontrada" });
      }
      res.json(franchise);
    } catch (error) {
      console.error("Erro ao rejeitar franquia:", error);
      res.status(500).json({ error: "Erro ao rejeitar franquia" });
    }
  });

  // API para usuários
  app.get("/api/users", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const user = await storage.updateUser(Number(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      await storage.deleteUser(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ error: "Erro ao deletar usuário" });
    }
  });

  app.post("/api/users/:id/approve", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const user = await storage.approveUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error) {
      console.error("Erro ao aprovar usuário:", error);
      res.status(500).json({ error: "Erro ao aprovar usuário" });
    }
  });

  app.post("/api/users/:id/reject", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const user = await storage.rejectUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
      res.json(user);
    } catch (error) {
      console.error("Erro ao rejeitar usuário:", error);
      res.status(500).json({ error: "Erro ao rejeitar usuário" });
    }
  });

  // API para planos
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getAllPlans();
      res.json(plans);
    } catch (error) {
      console.error("Erro ao buscar planos:", error);
      res.status(500).json({ error: "Erro ao buscar planos" });
    }
  });

  // API para clientes do franqueado
  app.get("/api/franchisee/clients", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      // Para franqueados, buscar todos os clientes (usuários com tipo 'client')
      const allUsers = await storage.getAllUsers();
      const clients = allUsers.filter(user => user.user_type === 'client');
      res.json(clients);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      res.status(500).json({ error: "Erro ao buscar clientes" });
    }
  });

  app.post("/api/franchisee/clients", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const clientData = {
        ...req.body,
        user_type: 'client',
        status: 'active',
        password: await argon2.hash('123456') // Senha padrão
      };
      
      const newClient = await storage.createUser(clientData);
      res.json(newClient);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      res.status(500).json({ error: "Erro ao criar cliente" });
    }
  });

  app.patch("/api/franchisee/clients/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const updatedClient = await storage.updateUser(parseInt(req.params.id), req.body);
      if (!updatedClient) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      res.json(updatedClient);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
  });

  app.delete("/api/franchisee/clients/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const success = await storage.deleteUser(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ error: "Cliente não encontrado" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      res.status(500).json({ error: "Erro ao deletar cliente" });
    }
  });

  // API para vendas do franqueado
  app.get("/api/franchisee/sales", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      // Simulação de vendas baseadas em dados reais do banco
      const users = await storage.getAllUsers();
      const sales = users.filter(user => user.user_type === 'client').map((client, index) => ({
        id: index + 1,
        client_name: client.name,
        client_id: client.id,
        product: `Óculos Premium ${index + 1}`,
        amount: Math.floor(Math.random() * 500) + 200,
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.8 ? 'pending' : 'completed'
      }));
      res.json(sales);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      res.status(500).json({ error: "Erro ao buscar vendas" });
    }
  });

  app.post("/api/franchisee/sales", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      // Simular criação de venda
      const saleData = {
        id: Date.now(),
        ...req.body,
        date: new Date().toISOString(),
        status: 'completed'
      };
      res.json(saleData);
    } catch (error) {
      console.error("Erro ao criar venda:", error);
      res.status(500).json({ error: "Erro ao criar venda" });
    }
  });

  // API para produtos
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });

  app.post("/api/products", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  });

  // API para estoque/inventário
  app.get("/api/franchisee/inventory", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      // Buscar inventário da franquia (assumindo franquia ID = 1 para demo)
      const inventory = await storage.getInventoryByFranchiseId(1);
      res.json(inventory);
    } catch (error) {
      console.error("Erro ao buscar inventário:", error);
      res.status(500).json({ error: "Erro ao buscar inventário" });
    }
  });

  // PUT - Editar item do inventário
  app.put("/api/franchisee/inventory/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const { id } = req.params;
      const updates = req.body;
      const inventory = await storage.updateInventory(parseInt(id), updates);
      res.json(inventory);
    } catch (error) {
      console.error("Erro ao atualizar inventário:", error);
      res.status(500).json({ error: "Erro ao atualizar inventário" });
    }
  });

  // DELETE - Deletar item do inventário
  app.delete("/api/franchisee/inventory/:id", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const { id } = req.params;
      await storage.deleteInventory(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Erro ao deletar inventário:", error);
      res.status(500).json({ error: "Erro ao deletar inventário" });
    }
  });

  // POST - Criar item do inventário
  app.post("/api/franchisee/inventory", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const inventory = await storage.createInventory(req.body);
      res.status(201).json(inventory);
    } catch (error) {
      console.error("Erro ao criar inventário:", error);
      res.status(500).json({ error: "Erro ao criar inventário" });
    }
  });

  // API para agendamentos
  app.get("/api/appointments", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const appointments = await storage.getAppointmentsByUserId(req.user.id);
      res.json(appointments);
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      res.status(500).json({ error: "Erro ao buscar agendamentos" });
    }
  });

  app.post("/api/appointments", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const appointment = await storage.createAppointment({
        ...req.body,
        user_id: req.user.id
      });
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      res.status(500).json({ error: "Erro ao criar agendamento" });
    }
  });

  // API para medições ópticas - FINAL
  app.get("/api/measurements", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    try {
      const measurements = await storage.getMeasurementsByUserId(req.user.id);
      res.json(measurements);
    } catch (error) {
      console.error("Erro ao buscar medições:", error);
      res.status(500).json({ error: "Erro ao buscar medições" });
    }
  });

  app.post("/api/measurements", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const measurement = await storage.createMeasurement({
        ...req.body,
        user_id: req.user.id
      });
      res.status(201).json(measurement);
    } catch (error) {
      console.error("Erro ao criar medição:", error);
      res.status(500).json({ error: "Erro ao criar medição" });
    }
  });

  // API para estatísticas do admin - CORREÇÃO URGENTE
  app.get("/api/admin/stats", async (req, res) => {
    try {
      // Log para debug
      console.log("=== API STATS REQUEST ===");
      console.log("User authenticated:", !!req.user);
      console.log("User type:", req.user?.user_type);

      // Verificar se é admin
      if (!req.user) {
        console.log("NO USER AUTHENTICATED");
        return res.status(401).json({ error: "Não autenticado" });
      }
      
      if (req.user.user_type !== 'admin') {
        console.log("USER IS NOT ADMIN:", req.user.user_type);
        return res.status(403).json({ error: "Acesso negado - não é admin" });
      }

      const [users, franchises, measurements] = await Promise.all([
        storage.getAllUsers(),
        storage.getAllFranchises(),
        storage.getAllMeasurements()
      ]);

      console.log("=== DADOS BRUTOS ===");
      console.log("Users array:", users);
      console.log("Users count:", users ? users.length : 0);
      console.log("Franchises count:", franchises ? franchises.length : 0);
      console.log("Measurements count:", measurements ? measurements.length : 0);

      // Garantir que temos arrays válidos
      const safeUsers = Array.isArray(users) ? users : [];
      const safeFranchises = Array.isArray(franchises) ? franchises : [];
      const safeMeasurements = Array.isArray(measurements) ? measurements : [];

      // Calcular estatísticas reais
      const totalUsers = safeUsers.length;
      const activeFranchises = safeFranchises.filter(f => f.status === 'active').length;
      
      // Medições de hoje
      const today = new Date();
      const todayMeasurements = safeMeasurements.filter(m => {
        const measurementDate = new Date(m.measured_at);
        return measurementDate.toDateString() === today.toDateString();
      }).length;

      // Calcular receita simulada
      const monthlyRevenue = activeFranchises * 15000 + totalUsers * 50;

      const stats = {
        totalUsers,
        activeFranchises,
        monthlyRevenue: `R$ ${(monthlyRevenue / 1000).toFixed(1)}K`,
        dailyMeasurements: todayMeasurements
      };

      console.log("=== ENVIANDO STATS ===", stats);
      res.json(stats);
    } catch (error) {
      console.error("ERRO AO BUSCAR ESTATÍSTICAS:", error);
      res.status(500).json({ error: "Erro ao buscar estatísticas" });
    }
  });

  // API para produtos - CRUD completo
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ error: error.message });
      }
      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      if (!success) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      res.status(500).json({ error: "Erro ao deletar produto" });
    }
  });

  // API para franquias - CRUD completo
  app.patch("/api/franchises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const franchise = await storage.updateFranchise(id, req.body);
      if (!franchise) {
        return res.status(404).json({ error: "Franchise not found" });
      }
      res.json(franchise);
    } catch (error) {
      console.error("Erro ao atualizar franquia:", error);
      res.status(500).json({ error: "Erro ao atualizar franquia" });
    }
  });

  app.delete("/api/franchises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteFranchise(id);
      if (!success) {
        return res.status(404).json({ error: "Franchise not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar franquia:", error);
      res.status(500).json({ error: "Erro ao deletar franquia" });
    }
  });

  // API para inventário
  app.get("/api/inventory", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      // Para franqueados, buscar apenas seu inventário
      if (req.user.user_type === 'franchisee') {
        // Buscar franquia do usuário (assumindo relação)
        const franchises = await storage.getAllFranchises();
        const userFranchise = franchises.find(f => f.owner_id === req.user?.id);
        
        if (userFranchise) {
          const inventory = await storage.getInventoryByFranchiseId(userFranchise.id);
          res.json(inventory);
        } else {
          res.json([]);
        }
      } else {
        // Para admins, mostrar todo inventário
        res.json([]);
      }
    } catch (error) {
      console.error("Erro ao buscar inventário:", error);
      res.status(500).json({ error: "Erro ao buscar inventário" });
    }
  });

  // API para criar item de inventário
  app.post("/api/franchisee/inventory", async (req, res) => {
    try {
      const inventoryData = insertInventorySchema.parse(req.body);
      const inventory = await storage.createInventory(inventoryData);
      res.status(201).json(inventory);
    } catch (error) {
      console.error("Erro ao criar item de inventário:", error);
      res.status(500).json({ error: "Erro ao criar item de inventário" });
    }
  });

  // API para atualizar item de inventário
  app.patch("/api/franchisee/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const inventoryData = insertInventorySchema.parse(req.body);
      const inventory = await storage.updateInventory(id, inventoryData);
      res.json(inventory);
    } catch (error) {
      console.error("Erro ao atualizar item de inventário:", error);
      res.status(500).json({ error: "Erro ao atualizar item de inventário" });
    }
  });

  // API para deletar item de inventário
  app.delete("/api/franchisee/inventory/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInventory(id);
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar item de inventário:", error);
      res.status(500).json({ error: "Erro ao deletar item de inventário" });
    }
  });

  // API para aplicações de franquia
  app.post("/api/franchise-applications", async (req, res) => {
    try {
      // Hash da senha antes de salvar
      const hashedPassword = await argon2.hash(req.body.password);
      const applicationData = {
        ...req.body,
        password: hashedPassword
      };
      
      const application = await storage.createFranchiseApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      console.error("Erro ao criar aplicação de franquia:", error);
      res.status(500).json({ error: "Erro ao criar aplicação de franquia" });
    }
  });

  app.get("/api/franchise-applications", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    if (req.user.user_type !== 'admin') return res.status(403).send("Forbidden");
    
    try {
      const applications = await storage.getAllFranchiseApplications();
      res.json(applications);
    } catch (error) {
      console.error("Erro ao buscar aplicações de franquia:", error);
      res.status(500).json({ error: "Erro ao buscar aplicações de franquia" });
    }
  });

  app.get("/api/franchise-applications/pending", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    if (req.user.user_type !== 'admin') return res.status(403).send("Forbidden");
    
    try {
      const applications = await storage.getPendingFranchiseApplications();
      res.json(applications);
    } catch (error) {
      console.error("Erro ao buscar aplicações pendentes:", error);
      res.status(500).json({ error: "Erro ao buscar aplicações pendentes" });
    }
  });

  app.post("/api/franchise-applications/:id/approve", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    if (req.user.user_type !== 'admin') return res.status(403).send("Forbidden");
    
    try {
      const id = parseInt(req.params.id);
      const { notes } = req.body;
      
      const application = await storage.approveFranchiseApplication(id, req.user.id, notes);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Erro ao aprovar aplicação:", error);
      res.status(500).json({ error: "Erro ao aprovar aplicação" });
    }
  });

  app.post("/api/franchise-applications/:id/reject", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    if (req.user.user_type !== 'admin') return res.status(403).send("Forbidden");
    
    try {
      const id = parseInt(req.params.id);
      const { notes } = req.body;
      
      const application = await storage.rejectFranchiseApplication(id, req.user.id, notes);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      console.error("Erro ao rejeitar aplicação:", error);
      res.status(500).json({ error: "Erro ao rejeitar aplicação" });
    }
  });

  // API para inventário de franquias
  app.get("/api/franchises/:id/inventory", async (req, res) => {
    if (!req.user) return res.status(401).send("Unauthorized");
    try {
      const inventory = await storage.getInventoryByFranchiseId(parseInt(req.params.id));
      res.json(inventory);
    } catch (error) {
      console.error("Erro ao buscar inventário:", error);
      res.status(500).json({ error: "Erro ao buscar inventário" });
    }
  });

  // Franchisee-specific routes
  app.get("/api/franchisee/sales", async (req, res) => {
    try {
      if (req.user!.user_type !== 'franchisee') {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const sales = [
        {
          id: 1,
          client_name: "Maria Silva",
          client_phone: "(11) 99999-8888",
          product_name: "Armação Ray-Ban RB5154",
          quantity: 1,
          unit_price: 450.00,
          total_price: 450.00,
          payment_method: "cartao_credito",
          status: "completed",
          sale_date: new Date().toISOString(),
          notes: "Cliente satisfeita com o produto"
        },
        {
          id: 2,
          client_name: "João Santos",
          client_phone: "(11) 88888-7777",
          product_name: "Lente Progressive Zeiss",
          quantity: 2,
          unit_price: 320.00,
          total_price: 640.00,
          payment_method: "pix",
          status: "pending",
          sale_date: new Date(Date.now() - 86400000).toISOString(),
          notes: ""
        }
      ];
      
      res.json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  });

  app.post("/api/franchisee/sales", async (req, res) => {
    try {
      if (req.user!.user_type !== 'franchisee') {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const saleData = {
        ...req.body,
        id: Date.now(),
        sale_date: new Date().toISOString(),
        status: 'completed'
      };
      
      res.status(201).json(saleData);
    } catch (error) {
      console.error("Error creating sale:", error);
      res.status(500).json({ error: "Failed to create sale" });
    }
  });

  app.get("/api/franchisee/clients", async (req, res) => {
    try {
      if (req.user!.user_type !== 'franchisee') {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const clients = [
        {
          id: 1,
          name: "Maria Silva",
          email: "maria.silva@email.com",
          phone: "(11) 99999-8888",
          cpf: "123.456.789-00",
          address: "Rua das Flores, 123",
          city: "São Paulo",
          state: "SP",
          birth_date: "1985-03-15",
          last_visit: new Date().toISOString(),
          total_spent: 1250.00,
          visit_count: 3,
          notes: "Cliente preferencial, gosta de armações modernas",
          status: "active",
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          name: "João Santos",
          email: "joao.santos@email.com",
          phone: "(11) 88888-7777",
          cpf: "987.654.321-00",
          address: "Av. Paulista, 456",
          city: "São Paulo",
          state: "SP",
          birth_date: "1978-07-22",
          last_visit: new Date(Date.now() - 86400000 * 30).toISOString(),
          total_spent: 850.00,
          visit_count: 2,
          notes: "Precisa de lentes para presbiopia",
          status: "active",
          created_at: "2024-02-10T14:30:00Z"
        }
      ];
      
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/franchisee/clients", async (req, res) => {
    try {
      const clientData = {
        ...req.body,
        id: Date.now(),
        total_spent: 0,
        visit_count: 0,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      res.status(201).json(clientData);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.patch("/api/franchisee/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedClient = { id, ...req.body };
      
      res.json(updatedClient);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.get("/api/franchisee/reports/:type", async (req, res) => {
    try {
      
      const { type } = req.params;
      
      if (type === 'financial') {
        res.json({
          revenue: 85420,
          expenses: 55000,
          profit: 30420,
          roi: 35.2
        });
      } else if (type === 'sales') {
        res.json([
          { month: 'Jan', sales: 65, revenue: 65000 },
          { month: 'Fev', sales: 72, revenue: 72000 },
          { month: 'Mar', sales: 78, revenue: 78000 },
          { month: 'Abr', sales: 85, revenue: 85420 }
        ]);
      } else if (type === 'clients') {
        res.json({
          total: 342,
          new_this_month: 28,
          retention_rate: 87
        });
      } else {
        res.json({});
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  // ADMIN ROUTES - Gestão de usuários e franquias
  app.get("/api/users", async (req, res) => {
    if (!req.user || req.user.user_type !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/users/:id/approve", async (req, res) => {
    if (!req.user || req.user.user_type !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      const user = await storage.approveUser(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve user" });
    }
  });

  app.patch("/api/users/:id/reject", async (req, res) => {
    if (!req.user || req.user.user_type !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      await storage.rejectUser(parseInt(req.params.id));
      res.json({ message: "User rejected" });
    } catch (error) {
      res.status(500).json({ error: "Failed to reject user" });
    }
  });

  app.get("/api/franchises", async (req, res) => {
    if (!req.user || req.user.user_type !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      const franchises = await storage.getAllFranchises();
      res.json(franchises);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch franchises" });
    }
  });

  app.get("/api/franchises/pending", async (req, res) => {
    if (!req.user || req.user.user_type !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      const pendingFranchises = await storage.getPendingFranchises();
      res.json(pendingFranchises);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pending franchises" });
    }
  });

  // FRANCHISEE ROUTES - Gestão de inventário e vendas
  app.get("/api/franchisee/inventory", async (req, res) => {
    if (!req.user || (req.user.user_type !== 'franchisee' && req.user.user_type !== 'admin')) {
      return res.status(403).json({ error: "Access denied" });
    }
    try {
      let franchiseId;
      if (req.user.user_type === 'franchisee') {
        const userFranchise = await storage.getAllFranchises();
        franchiseId = userFranchise.find(f => f.owner_id === req.user.id)?.id || 1;
      } else {
        franchiseId = parseInt(req.query.franchiseId as string) || 1;
      }
      
      const inventory = await storage.getInventoryByFranchiseId(franchiseId);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  // Rota para popular o banco de dados (apenas para ambiente de desenvolvimento)
  if (process.env.NODE_ENV === 'development') {
    app.post("/api/seed", async (req, res) => {
      try {
        await storage.seedDemoData();
        res.json({ message: "Banco de dados populado com sucesso!" });
      } catch (error) {
        console.error("Erro ao popular banco de dados:", error);
        res.status(500).json({ error: "Erro ao popular banco de dados" });
      }
    });
  }

  // Notifications routes
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const notifications = await storage.getNotificationsByUserId(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/notifications/unread-count", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const count = await storage.getUnreadNotificationsCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ error: "Failed to fetch unread count" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.use('/api', opticalMeasurementRouter);

  // Criar servidor HTTP
  const httpServer = createServer(app);

  return httpServer;
}