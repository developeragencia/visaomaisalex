import { 
  users, franchises, plans, userPlans, appointments, measurements, 
  products, inventory, franchiseApplications, supportTickets, notifications,
  type User, type InsertUser, type Franchise, type InsertFranchise,
  type Plan, type InsertPlan, type UserPlan, type InsertUserPlan,
  type Appointment, type InsertAppointment, type Measurement, type InsertMeasurement,
  type Product, type InsertProduct, type Inventory, type InsertInventory,
  type FranchiseApplication, type InsertFranchiseApplication,
  type SupportTicket, type InsertSupportTicket, type Notification, type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(insertUser: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Franchise methods
  getFranchise(id: number): Promise<Franchise | undefined>;
  getAllFranchises(): Promise<Franchise[]>;
  createFranchise(insertFranchise: InsertFranchise): Promise<Franchise>;
  updateFranchise(id: number, updates: Partial<Franchise>): Promise<Franchise>;
  deleteFranchise(id: number): Promise<void>;
  
  // Plan methods
  getPlan(id: number): Promise<Plan | undefined>;
  getAllPlans(): Promise<Plan[]>;
  createPlan(insertPlan: InsertPlan): Promise<Plan>;
  updatePlan(id: number, updates: Partial<Plan>): Promise<Plan>;
  deletePlan(id: number): Promise<void>;
  
  // UserPlan methods
  getUserPlan(id: number): Promise<UserPlan | undefined>;
  getUserPlansByUserId(userId: number): Promise<UserPlan[]>;
  createUserPlan(insertUserPlan: InsertUserPlan): Promise<UserPlan>;
  updateUserPlan(id: number, updates: Partial<UserPlan>): Promise<UserPlan>;
  deleteUserPlan(id: number): Promise<void>;
  
  // Appointment methods
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByUserId(userId: number): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  createAppointment(insertAppointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  
  // Measurement methods
  getMeasurement(id: number): Promise<Measurement | undefined>;
  getMeasurementsByUserId(userId: number): Promise<Measurement[]>;
  getAllMeasurements(): Promise<Measurement[]>;
  createMeasurement(insertMeasurement: InsertMeasurement): Promise<Measurement>;
  updateMeasurement(id: number, updates: Partial<Measurement>): Promise<Measurement>;
  deleteMeasurement(id: number): Promise<void>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(insertProduct: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Inventory methods
  getInventory(id: number): Promise<Inventory | undefined>;
  getInventoryByFranchiseId(franchiseId: number): Promise<Inventory[]>;
  getAllInventory(): Promise<Inventory[]>;
  createInventory(insertInventory: InsertInventory): Promise<Inventory>;
  updateInventory(id: number, updates: Partial<Inventory>): Promise<Inventory>;
  deleteInventory(id: number): Promise<void>;

  // Franchise Application methods
  getFranchiseApplication(id: number): Promise<FranchiseApplication | undefined>;
  getAllFranchiseApplications(): Promise<FranchiseApplication[]>;
  createFranchiseApplication(insertApplication: InsertFranchiseApplication): Promise<FranchiseApplication>;
  updateFranchiseApplication(id: number, updates: Partial<FranchiseApplication>): Promise<FranchiseApplication>;
  deleteFranchiseApplication(id: number): Promise<void>;

  // Support Ticket methods
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  getSupportTicketsByUserId(userId: number): Promise<SupportTicket[]>;
  getAllSupportTickets(): Promise<SupportTicket[]>;
  createSupportTicket(insertTicket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, updates: Partial<SupportTicket>): Promise<SupportTicket>;
  deleteSupportTicket(id: number): Promise<void>;

  // Notification methods
  getNotificationsByUserId(userId: number): Promise<Notification[]>;
  getUnreadNotificationsCount(userId: number): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;

  // Admin methods
  getPendingFranchises(): Promise<Franchise[]>;
  approveFranchise(id: number): Promise<Franchise>;
  rejectFranchise(id: number): Promise<void>;
  approveUser(id: number): Promise<User>;
  rejectUser(id: number): Promise<void>;
  getPendingFranchiseApplications(): Promise<FranchiseApplication[]>;
  approveFranchiseApplication(id: number): Promise<FranchiseApplication>;
  rejectFranchiseApplication(id: number): Promise<void>;
  seedDemoData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    console.log(`Storage: Buscando usuário por email: ${email}`);
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      console.log(`Storage: Usuário encontrado:`, user ? `${user.username} (${user.email})` : 'Nenhum');
      return user || undefined;
    } catch (error) {
      console.error(`Storage: Erro ao buscar por email:`, error);
      return undefined;
    }
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Franchise methods
  async getFranchise(id: number): Promise<Franchise | undefined> {
    const [franchise] = await db.select().from(franchises).where(eq(franchises.id, id));
    return franchise || undefined;
  }

  async getAllFranchises(): Promise<Franchise[]> {
    return db.select().from(franchises);
  }

  async createFranchise(insertFranchise: InsertFranchise): Promise<Franchise> {
    const [franchise] = await db.insert(franchises).values(insertFranchise).returning();
    return franchise;
  }

  async updateFranchise(id: number, updates: Partial<Franchise>): Promise<Franchise> {
    const [franchise] = await db.update(franchises).set(updates).where(eq(franchises.id, id)).returning();
    return franchise;
  }

  async deleteFranchise(id: number): Promise<void> {
    await db.delete(franchises).where(eq(franchises.id, id));
  }

  // Plan methods
  async getPlan(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan || undefined;
  }

  async getAllPlans(): Promise<Plan[]> {
    return db.select().from(plans);
  }

  async createPlan(insertPlan: InsertPlan): Promise<Plan> {
    const [plan] = await db.insert(plans).values(insertPlan).returning();
    return plan;
  }

  async updatePlan(id: number, updates: Partial<Plan>): Promise<Plan> {
    const [plan] = await db.update(plans).set(updates).where(eq(plans.id, id)).returning();
    return plan;
  }

  async deletePlan(id: number): Promise<void> {
    await db.delete(plans).where(eq(plans.id, id));
  }

  // UserPlan methods
  async getUserPlan(id: number): Promise<UserPlan | undefined> {
    const [userPlan] = await db.select().from(userPlans).where(eq(userPlans.id, id));
    return userPlan || undefined;
  }

  async getUserPlansByUserId(userId: number): Promise<UserPlan[]> {
    return db.select().from(userPlans).where(eq(userPlans.user_id, userId));
  }

  async createUserPlan(insertUserPlan: InsertUserPlan): Promise<UserPlan> {
    const [userPlan] = await db.insert(userPlans).values(insertUserPlan).returning();
    return userPlan;
  }

  async updateUserPlan(id: number, updates: Partial<UserPlan>): Promise<UserPlan> {
    const [userPlan] = await db.update(userPlans).set(updates).where(eq(userPlans.id, id)).returning();
    return userPlan;
  }

  async deleteUserPlan(id: number): Promise<void> {
    await db.delete(userPlans).where(eq(userPlans.id, id));
  }

  // Appointment methods
  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async getAppointmentsByUserId(userId: number): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.user_id, userId))
      .orderBy(desc(appointments.appointment_date));
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments).orderBy(desc(appointments.appointment_date));
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    try {
      const [appointment] = await db
        .insert(appointments)
        .values(appointmentData)
        .returning();
      
      return appointment;
    } catch (error) {
      console.error("Storage: Error creating appointment:", error);
      throw error;
    }
  }

  async updateAppointment(id: number, updates: Partial<Appointment>): Promise<Appointment> {
    const [appointment] = await db.update(appointments).set(updates).where(eq(appointments.id, id)).returning();
    return appointment;
  }

  async deleteAppointment(id: number): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  // Measurement methods
  async getMeasurement(id: number): Promise<Measurement | undefined> {
    const [measurement] = await db.select().from(measurements).where(eq(measurements.id, id));
    return measurement || undefined;
  }

  async getMeasurementsByUserId(userId: number): Promise<Measurement[]> {
    return db
      .select()
      .from(measurements)
      .where(eq(measurements.user_id, userId))
      .orderBy(desc(measurements.created_at));
  }

  async getAllMeasurements(): Promise<Measurement[]> {
    return db.select().from(measurements).orderBy(desc(measurements.created_at));
  }

  async createMeasurement(insertMeasurement: InsertMeasurement): Promise<Measurement> {
    const [measurement] = await db.insert(measurements).values(insertMeasurement).returning();
    return measurement;
  }

  async updateMeasurement(id: number, updates: Partial<Measurement>): Promise<Measurement> {
    const [measurement] = await db.update(measurements).set(updates).where(eq(measurements.id, id)).returning();
    return measurement;
  }

  async deleteMeasurement(id: number): Promise<void> {
    await db.delete(measurements).where(eq(measurements.id, id));
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Inventory methods
  async getInventory(id: number): Promise<Inventory | undefined> {
    const [inventoryItem] = await db.select().from(inventory).where(eq(inventory.id, id));
    return inventoryItem || undefined;
  }

  async getInventoryByFranchiseId(franchiseId: number): Promise<Inventory[]> {
    return db.select().from(inventory).where(eq(inventory.franchise_id, franchiseId));
  }

  async getAllInventory(): Promise<Inventory[]> {
    return db.select().from(inventory);
  }

  async createInventory(insertInventory: InsertInventory): Promise<Inventory> {
    const [inventoryItem] = await db.insert(inventory).values(insertInventory).returning();
    return inventoryItem;
  }

  async updateInventory(id: number, updates: Partial<Inventory>): Promise<Inventory> {
    const [inventoryItem] = await db.update(inventory).set(updates).where(eq(inventory.id, id)).returning();
    return inventoryItem;
  }

  async deleteInventory(id: number): Promise<void> {
    await db.delete(inventory).where(eq(inventory.id, id));
  }

  // Franchise Application methods
  async getFranchiseApplication(id: number): Promise<FranchiseApplication | undefined> {
    const [application] = await db.select().from(franchiseApplications).where(eq(franchiseApplications.id, id));
    return application || undefined;
  }

  async getAllFranchiseApplications(): Promise<FranchiseApplication[]> {
    return db.select().from(franchiseApplications).orderBy(desc(franchiseApplications.created_at));
  }

  async createFranchiseApplication(insertApplication: InsertFranchiseApplication): Promise<FranchiseApplication> {
    const [application] = await db.insert(franchiseApplications).values(insertApplication).returning();
    return application;
  }

  async updateFranchiseApplication(id: number, updates: Partial<FranchiseApplication>): Promise<FranchiseApplication> {
    const [application] = await db.update(franchiseApplications).set(updates).where(eq(franchiseApplications.id, id)).returning();
    return application;
  }

  async deleteFranchiseApplication(id: number): Promise<void> {
    await db.delete(franchiseApplications).where(eq(franchiseApplications.id, id));
  }

  // Support Ticket methods
  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id));
    return ticket || undefined;
  }

  async getSupportTicketsByUserId(userId: number): Promise<SupportTicket[]> {
    return db.select().from(supportTickets).where(eq(supportTickets.user_id, userId));
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return db.select().from(supportTickets).orderBy(desc(supportTickets.created_at));
  }

  async createSupportTicket(insertTicket: InsertSupportTicket): Promise<SupportTicket> {
    const [ticket] = await db.insert(supportTickets).values(insertTicket).returning();
    return ticket;
  }

  async updateSupportTicket(id: number, updates: Partial<SupportTicket>): Promise<SupportTicket> {
    const [ticket] = await db.update(supportTickets).set(updates).where(eq(supportTickets.id, id)).returning();
    return ticket;
  }

  async deleteSupportTicket(id: number): Promise<void> {
    await db.delete(supportTickets).where(eq(supportTickets.id, id));
  }

  // Notifications
  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.user_id, userId))
      .orderBy(desc(notifications.created_at));
  }

  async getUnreadNotificationsCount(userId: number): Promise<number> {
    const result = await db.select({ count: count() }).from(notifications)
      .where(and(eq(notifications.user_id, userId), eq(notifications.read, false)));
    return result[0]?.count || 0;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.user_id, userId));
  }

  async deleteNotification(id: number): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }

  // Admin methods implementation
  async getPendingFranchises(): Promise<Franchise[]> {
    return await db.select().from(franchises).where(eq(franchises.status, 'pending'));
  }

  async approveFranchise(id: number): Promise<Franchise> {
    const [franchise] = await db
      .update(franchises)
      .set({ status: 'active' })
      .where(eq(franchises.id, id))
      .returning();
    return franchise;
  }

  async rejectFranchise(id: number): Promise<void> {
    await db
      .update(franchises)
      .set({ status: 'rejected' })
      .where(eq(franchises.id, id));
  }

  async approveUser(id: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ status: 'active' })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async rejectUser(id: number): Promise<void> {
    await db
      .update(users)
      .set({ status: 'rejected' })
      .where(eq(users.id, id));
  }

  async getPendingFranchiseApplications(): Promise<FranchiseApplication[]> {
    return await db.select().from(franchiseApplications).where(eq(franchiseApplications.status, 'pending'));
  }

  async approveFranchiseApplication(id: number): Promise<FranchiseApplication> {
    const [application] = await db
      .update(franchiseApplications)
      .set({ 
        status: 'approved',
        reviewed_at: new Date(),
        reviewed_by: 1 // admin user
      })
      .where(eq(franchiseApplications.id, id))
      .returning();
    return application;
  }

  async rejectFranchiseApplication(id: number): Promise<void> {
    await db
      .update(franchiseApplications)
      .set({ 
        status: 'rejected',
        reviewed_at: new Date(),
        reviewed_by: 1 // admin user
      })
      .where(eq(franchiseApplications.id, id));
  }

  async seedDemoData(): Promise<void> {
    // Verificar se já existe dados
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('Dados demo já existem, pulando seed...');
      return;
    }

    console.log('Criando dados demo...');
    
    // Criar produtos demo
    const demoProducts = await db.insert(products).values([
      {
        name: 'Óculos Ray-Ban Aviator',
        description: 'Óculos clássico aviador com proteção UV',
        category: 'frames',
        brand: 'Ray-Ban',
        price: 45000, // R$ 450,00
        cost: 25000,  // R$ 250,00
        sku: 'RB-AV-001',
        image_url: '/images/rayban-aviator.jpg',
        status: 'active'
      },
      {
        name: 'Lentes de Contato Acuvue',
        description: 'Lentes de contato diárias com proteção UV',
        category: 'lenses',
        brand: 'Acuvue',
        price: 12000, // R$ 120,00
        cost: 6000,   // R$ 60,00
        sku: 'AC-UV-001',
        image_url: '/images/acuvue-daily.jpg',
        status: 'active'
      },
      {
        name: 'Armação Oakley Holbrook',
        description: 'Armação esportiva com design moderno',
        category: 'frames',
        brand: 'Oakley',
        price: 55000, // R$ 550,00
        cost: 30000,  // R$ 300,00
        sku: 'OK-HB-001',
        image_url: '/images/oakley-holbrook.jpg',
        status: 'active'
      }
    ]).returning();

    console.log('Dados demo criados com sucesso!');
  }
}

export const storage = new DatabaseStorage();

import { pool } from './db';

// Configuração do SessionStore atualizada com novas credenciais
export const sessionStore = new PostgresSessionStore({
  conString: "postgresql://neondb_owner:npg_Kp0Agf4nHyMJ@ep-lingering-sky-a6wq202k.us-west-2.aws.neon.tech/neondb?sslmode=require",
  tableName: 'sessions',
  createTableIfMissing: true
});