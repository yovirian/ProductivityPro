import {
  type Event,
  type InsertEvent,
  type Task,
  type InsertTask,
  type HealthMetric,
  type InsertHealthMetric,
  type Device,
  type InsertDevice,
  type DeviceReading,
  type InsertDeviceReading,
} from "@shared/schema";
import { mockDeviceReadings } from "../client/src/lib/mock";

export interface IStorage {
  // Events
  getEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Tasks
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Health Metrics
  getHealthMetrics(): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;

  // IoT Devices
  getDevices(): Promise<Device[]>;
  getDeviceById(deviceId: string): Promise<Device | null>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDeviceLastSync(deviceId: string): Promise<void>;

  // Device Readings
  getDeviceReadings(deviceId: string): Promise<DeviceReading[]>;
  createDeviceReading(reading: InsertDeviceReading): Promise<DeviceReading>;
}

export class MemStorage implements IStorage {
  private events: Map<number, Event>;
  private tasks: Map<number, Task>;
  private healthMetrics: Map<number, HealthMetric>;
  private devices: Map<string, Device>;
  private deviceReadings: Map<number, DeviceReading>;
  private currentId: number;

  constructor() {
    this.events = new Map();
    this.tasks = new Map();
    this.healthMetrics = new Map();
    this.devices = new Map();
    this.deviceReadings = new Map();
    this.currentId = 1;

    // Initialize with mock data
    mockDeviceReadings.forEach(reading => {
      this.deviceReadings.set(reading.id, reading);
    });
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentId++;
    const newEvent = { 
      ...event, 
      id,
      description: event.description ?? null // Ensure description is never undefined
    };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    this.events.delete(id);
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const newTask = { 
      ...task, 
      id,
      completed: task.completed ?? false, // Default to false if not provided
      dueDate: task.dueDate ?? null // Ensure dueDate is never undefined
    };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task> {
    const existing = this.tasks.get(id);
    if (!existing) throw new Error("Task not found");
    const updated = { ...existing, ...task };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<void> {
    this.tasks.delete(id);
  }

  async getHealthMetrics(): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values());
  }

  async createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.currentId++;
    const newMetric = { ...metric, id };
    this.healthMetrics.set(id, newMetric);
    return newMetric;
  }

  async getDevices(): Promise<Device[]> {
    return Array.from(this.devices.values());
  }

  async getDeviceById(deviceId: string): Promise<Device | null> {
    return this.devices.get(deviceId) || null;
  }

  async createDevice(device: InsertDevice): Promise<Device> {
    const newDevice = {
      ...device,
      id: this.currentId++,
      lastSync: new Date(),
      metadata: device.metadata ?? null // Ensure metadata is never undefined
    };
    this.devices.set(device.deviceId, newDevice);
    return newDevice;
  }

  async updateDeviceLastSync(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (device) {
      device.lastSync = new Date();
      this.devices.set(deviceId, device);
    }
  }

  async getDeviceReadings(deviceId: string): Promise<DeviceReading[]> {
    return Array.from(this.deviceReadings.values())
      .filter(reading => reading.deviceId === deviceId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createDeviceReading(reading: InsertDeviceReading): Promise<DeviceReading> {
    const id = this.currentId++;
    const newReading = { ...reading, id };
    this.deviceReadings.set(id, newReading);
    return newReading;
  }
}

export const storage = new MemStorage();