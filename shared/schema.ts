import { pgTable, text, serial, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  start: timestamp("start").notNull(),
  end: timestamp("end").notNull(),
  description: text("description"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  dueDate: timestamp("due_date"),
});

export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  steps: integer("steps").notNull(),
  calories: integer("calories").notNull(),
  waterIntake: integer("water_intake").notNull(),
  sleepHours: integer("sleep_hours").notNull(),
});

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull().unique(),
  deviceType: text("device_type").notNull(),
  name: text("name").notNull(),
  lastSync: timestamp("last_sync"),
  metadata: jsonb("metadata"),
});

export const deviceReadings = pgTable("device_readings", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  data: jsonb("data").notNull(),
});

export const insertDeviceSchema = createInsertSchema(devices).omit({ id: true, lastSync: true });
export const insertDeviceReadingSchema = createInsertSchema(deviceReadings)
  .omit({ id: true })
  .extend({
    data: z.object({
      acceleration: z.number().optional(),
      orientation: z.number().optional(),
      motion: z.boolean().optional(),
      screenTime: z.number().optional(),
    }),
  });

export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export const insertTaskSchema = createInsertSchema(tasks).omit({ id: true });
export const insertHealthMetricSchema = createInsertSchema(healthMetrics).omit({ id: true });

export type Event = typeof events.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;
export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type Device = typeof devices.$inferSelect;
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type DeviceReading = typeof deviceReadings.$inferSelect;
export type InsertDeviceReading = z.infer<typeof insertDeviceReadingSchema>;