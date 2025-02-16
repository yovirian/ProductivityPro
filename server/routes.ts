import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { storage } from "./storage";
import { 
  insertEventSchema, 
  insertTaskSchema, 
  insertHealthMetricSchema,
  insertDeviceSchema,
  insertDeviceReadingSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup WebSocket server for real-time device updates
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: "/ws/devices" // Dedicated path for device WebSocket
  });

  wss.on("connection", (ws) => {
    console.log("New WebSocket connection established");

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "device_reading") {
          const reading = insertDeviceReadingSchema.parse(data.payload);
          const created = await storage.createDeviceReading(reading);
          await storage.updateDeviceLastSync(reading.deviceId);

          // Broadcast the new reading to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: "new_reading",
                payload: created,
              }));
            }
          });
        }
      } catch (error) {
        console.error("WebSocket error:", error);
        ws.send(JSON.stringify({ error: "Invalid message format" }));
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  // IoT Device Routes
  app.get("/api/devices", async (_req, res) => {
    const devices = await storage.getDevices();
    res.json(devices);
  });

  app.get("/api/devices/:deviceId", async (req, res) => {
    const device = await storage.getDeviceById(req.params.deviceId);
    if (!device) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    res.json(device);
  });

  app.post("/api/devices", async (req, res) => {
    const device = insertDeviceSchema.parse(req.body);
    const created = await storage.createDevice(device);
    res.json(created);
  });

  app.get("/api/devices/:deviceId/readings", async (req, res) => {
    const readings = await storage.getDeviceReadings(req.params.deviceId);
    res.json(readings);
  });

  app.post("/api/devices/:deviceId/readings", async (req, res) => {
    const reading = insertDeviceReadingSchema.parse({
      ...req.body,
      deviceId: req.params.deviceId,
    });
    const created = await storage.createDeviceReading(reading);
    await storage.updateDeviceLastSync(req.params.deviceId);
    res.json(created);
  });

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

  return httpServer;
}