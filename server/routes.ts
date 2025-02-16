import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEventSchema, insertTaskSchema, insertHealthMetricSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Events routes
  app.get("/api/events", async (_req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    const event = insertEventSchema.parse(req.body);
    const created = await storage.createEvent(event);
    res.json(created);
  });

  app.delete("/api/events/:id", async (req, res) => {
    await storage.deleteEvent(Number(req.params.id));
    res.status(204).end();
  });

  // Tasks routes
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const task = insertTaskSchema.parse(req.body);
    const created = await storage.createTask(task);
    res.json(created);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const updated = await storage.updateTask(Number(req.params.id), req.body);
    res.json(updated);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    await storage.deleteTask(Number(req.params.id));
    res.status(204).end();
  });

  // Health metrics routes
  app.get("/api/health-metrics", async (_req, res) => {
    const metrics = await storage.getHealthMetrics();
    res.json(metrics);
  });

  app.post("/api/health-metrics", async (req, res) => {
    const metric = insertHealthMetricSchema.parse(req.body);
    const created = await storage.createHealthMetric(metric);
    res.json(created);
  });

  const httpServer = createServer(app);
  return httpServer;
}
