import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  cpf: text("cpf"),
  phone: text("phone"),
  user_type: text("user_type").notNull().default("client"), // "client", "franchisee", "admin"
  status: text("status").notNull().default("active"), // "active", "pending", "inactive"
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

// Franchises table
export const franchises = pgTable("franchises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  phone: text("phone").notNull(),
  owner_id: integer("owner_id").notNull().references(() => users.id),
  status: text("status").notNull().default("pending"), // "active", "pending", "inactive"
  created_at: timestamp("created_at").defaultNow(),
});

// Memberships/Plans table
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  consultations_per_year: integer("consultations_per_year").notNull(),
  exams_per_year: integer("exams_per_year").notNull(),
  discount_percentage: integer("discount_percentage").notNull(),
  features: text("features").array(),
  created_at: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // "info", "success", "warning", "error"
  read: boolean("read").notNull().default(false),
  created_at: timestamp("created_at").defaultNow(),
});

// User Plans relationship
export const userPlans = pgTable("user_plans", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  plan_id: integer("plan_id").notNull().references(() => plans.id),
  start_date: timestamp("start_date").notNull().defaultNow(),
  end_date: timestamp("end_date"),
  status: text("status").notNull().default("active"), // "active", "expired", "cancelled"
  created_at: timestamp("created_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  franchise_id: integer("franchise_id").references(() => franchises.id),
  appointment_date: timestamp("appointment_date").notNull(),
  service_type: text("service_type").notNull(), // "consultation", "exam", "measurement"
  status: text("status").notNull().default("scheduled"), // "scheduled", "completed", "cancelled", "no_show"
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow(),
});

// Optical measurements table
export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  
  // Distância Pupilar (PD)
  pupillary_distance: decimal("pupillary_distance", { precision: 5, scale: 2 }), // mm
  monocular_pd_right: decimal("monocular_pd_right", { precision: 5, scale: 2 }), // mm
  monocular_pd_left: decimal("monocular_pd_left", { precision: 5, scale: 2 }), // mm
  
  // Centros Ópticos
  optical_center_right_x: decimal("optical_center_right_x", { precision: 5, scale: 2 }), // mm
  optical_center_right_y: decimal("optical_center_right_y", { precision: 5, scale: 2 }), // mm
  optical_center_left_x: decimal("optical_center_left_x", { precision: 5, scale: 2 }), // mm
  optical_center_left_y: decimal("optical_center_left_y", { precision: 5, scale: 2 }), // mm
  
  // Altura do Segmento
  segment_height_right: decimal("segment_height_right", { precision: 5, scale: 2 }), // mm
  segment_height_left: decimal("segment_height_left", { precision: 5, scale: 2 }), // mm
  
  // Dados da Armação
  frame_width: decimal("frame_width", { precision: 5, scale: 2 }), // mm
  frame_height: decimal("frame_height", { precision: 5, scale: 2 }), // mm
  bridge_width: decimal("bridge_width", { precision: 5, scale: 2 }), // mm
  temple_length: decimal("temple_length", { precision: 5, scale: 2 }), // mm
  
  // Ângulos e Distâncias
  pantoscopic_tilt: decimal("pantoscopic_tilt", { precision: 5, scale: 2 }), // graus
  face_form_angle: decimal("face_form_angle", { precision: 5, scale: 2 }), // graus
  vertex_distance: decimal("vertex_distance", { precision: 5, scale: 2 }), // mm
  
  // Dados do Rosto
  face_width: decimal("face_width", { precision: 5, scale: 2 }), // mm
  face_height: decimal("face_height", { precision: 5, scale: 2 }), // mm
  nose_bridge_width: decimal("nose_bridge_width", { precision: 5, scale: 2 }), // mm
  
  // Dados de Qualidade da Medição
  measurement_quality_score: decimal("measurement_quality_score", { precision: 3, scale: 2 }), // 0-1
  face_detection_confidence: decimal("face_detection_confidence", { precision: 3, scale: 2 }), // 0-1
  lighting_condition: text("lighting_condition"), // good, fair, poor
  
  // Método e Equipamento
  measurement_method: text("measurement_method").notNull(), // camera, ruler, pupilometer
  device_info: text("device_info"), // informações do dispositivo usado
  calibration_object: text("calibration_object"), // tipo de objeto de calibração usado
  
  // Imagem de Referência
  reference_image_url: text("reference_image_url"),
  processed_image_url: text("processed_image_url"),
  
  // Dados de Auditoria
  measured_by: integer("measured_by").references(() => users.id),
  verified_by: integer("verified_by").references(() => users.id),
  notes: text("notes"),
  
  measured_at: timestamp("measured_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "frames", "lenses", "accessories"
  brand: text("brand"),
  price: integer("price").notNull(), // in cents
  cost: integer("cost").notNull(), // in cents
  sku: text("sku").unique(),
  image_url: text("image_url"),
  status: text("status").notNull().default("active"), // "active", "discontinued"
  created_at: timestamp("created_at").defaultNow(),
});

// Inventory table
export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id").notNull().references(() => products.id),
  franchise_id: integer("franchise_id").notNull().references(() => franchises.id),
  quantity: integer("quantity").notNull().default(0),
  min_stock: integer("min_stock").notNull().default(5),
  max_stock: integer("max_stock").notNull().default(100),
  last_updated: timestamp("last_updated").defaultNow(),
});

// Franchise Applications table
export const franchiseApplications = pgTable("franchise_applications", {
  id: serial("id").primaryKey(),
  // Dados Pessoais
  full_name: text("full_name").notNull(),
  cpf: text("cpf").notNull(),
  rg: text("rg").notNull(),
  birth_date: text("birth_date").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  
  // Endereço
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip_code: text("zip_code").notNull(),
  
  // Dados da Empresa
  company_name: text("company_name").notNull(),
  cnpj: text("cnpj"),
  business_experience: text("business_experience").notNull(),
  
  // Localização Pretendida
  target_city: text("target_city").notNull(),
  target_state: text("target_state").notNull(),
  has_location: boolean("has_location").default(false),
  location_details: text("location_details"),
  
  // Investimento
  available_capital: text("available_capital").notNull(),
  financing_needed: boolean("financing_needed").default(false),
  investment_timeline: text("investment_timeline").notNull(),
  
  // Dados de Acesso
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  
  // Status e Controle
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  created_at: timestamp("created_at").defaultNow(),
  reviewed_at: timestamp("reviewed_at"),
  reviewed_by: integer("reviewed_by").references(() => users.id),
  admin_notes: text("admin_notes"),
});

// Support Tickets table
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull().references(() => users.id),
  subject: text("subject").notNull(),
  category: text("category").notNull(), // "technical", "billing", "product", "training", "other"
  priority: text("priority").notNull(), // "low", "medium", "high", "urgent"
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // "open", "in_progress", "resolved", "closed"
  assigned_to: integer("assigned_to").references(() => users.id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  resolved_at: timestamp("resolved_at"),
});

// Zod schemas for insertions
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true
});

export const insertFranchiseSchema = createInsertSchema(franchises).omit({
  id: true,
  created_at: true
});

export const insertPlanSchema = createInsertSchema(plans).omit({
  id: true,
  created_at: true
});

export const insertUserPlanSchema = createInsertSchema(userPlans).omit({
  id: true,
  created_at: true
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  created_at: true
});

export const insertMeasurementSchema = createInsertSchema(measurements).omit({
  id: true,
  created_at: true
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  created_at: true
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  last_updated: true
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  created_at: true
});

export const insertFranchiseApplicationSchema = createInsertSchema(franchiseApplications).omit({
  id: true,
  created_at: true,
  reviewed_at: true,
  reviewed_by: true
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  created_at: true,
  updated_at: true,
  resolved_at: true
});

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Franchise = typeof franchises.$inferSelect;
export type InsertFranchise = z.infer<typeof insertFranchiseSchema>;

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = z.infer<typeof insertPlanSchema>;

export type UserPlan = typeof userPlans.$inferSelect;
export type InsertUserPlan = z.infer<typeof insertUserPlanSchema>;

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

export type Measurement = typeof measurements.$inferSelect;
export type InsertMeasurement = z.infer<typeof insertMeasurementSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type FranchiseApplication = typeof franchiseApplications.$inferSelect;
export type InsertFranchiseApplication = z.infer<typeof insertFranchiseApplicationSchema>;

export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  franchises: many(franchises),
  userPlans: many(userPlans),
  appointments: many(appointments),
  measurements: many(measurements),
  supportTickets: many(supportTickets),
}));

export const franchisesRelations = relations(franchises, ({ one, many }) => ({
  owner: one(users, {
    fields: [franchises.owner_id],
    references: [users.id],
  }),
  appointments: many(appointments),
  inventory: many(inventory),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  userPlans: many(userPlans),
}));

export const userPlansRelations = relations(userPlans, ({ one }) => ({
  user: one(users, {
    fields: [userPlans.user_id],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [userPlans.plan_id],
    references: [plans.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.user_id],
    references: [users.id],
  }),
  franchise: one(franchises, {
    fields: [appointments.franchise_id],
    references: [franchises.id],
  }),
}));

export const measurementsRelations = relations(measurements, ({ one }) => ({
  user: one(users, {
    fields: [measurements.user_id],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  inventory: many(inventory),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.product_id],
    references: [products.id],
  }),
  franchise: one(franchises, {
    fields: [inventory.franchise_id],
    references: [franchises.id],
  }),
}));

export const franchiseApplicationsRelations = relations(franchiseApplications, ({ one }) => ({
  reviewer: one(users, {
    fields: [franchiseApplications.reviewed_by],
    references: [users.id],
  }),
}));