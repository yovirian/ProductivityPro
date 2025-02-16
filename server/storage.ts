import {
  type Event,
  type InsertEvent,
  type Task,
  type InsertTask,
  type HealthMetric,
  type InsertHealthMetric,
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private events: Map<number, Event>;
  private tasks: Map<number, Task>;
  private healthMetrics: Map<number, HealthMetric>;
  private currentId: number;

  constructor() {
    this.events = new Map();
    this.tasks = new Map();
    this.healthMetrics = new Map();
    this.currentId = 1;
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = this.currentId++;
    const newEvent = { ...event, id };
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
    const newTask = { ...task, id };
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
}

export const storage = new MemStorage();
