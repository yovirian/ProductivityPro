import { addDays, subDays } from "date-fns";
import type { HealthMetric, Event, Task, DeviceReading } from "@shared/schema";

export const mockHealthMetrics: HealthMetric[] = Array.from({ length: 7 }).map((_, i) => ({
  id: i + 1,
  date: new Date(subDays(new Date(), i)),
  steps: Math.floor(Math.random() * 5000) + 5000,
  calories: Math.floor(Math.random() * 500) + 1500,
  waterIntake: Math.floor(Math.random() * 4) + 4,
  sleepHours: Math.floor(Math.random() * 3) + 6,
}));

export const mockEvents: Event[] = [
  {
    id: 1,
    title: "Team Meeting",
    start: new Date(),
    end: addDays(new Date(), 1),
    description: "Weekly sync meeting",
  },
  {
    id: 2,
    title: "Project Review",
    start: addDays(new Date(), 2),
    end: addDays(new Date(), 2),
    description: "Review project progress",
  },
];

export const mockTasks: Task[] = [
  {
    id: 1,
    title: "Complete project proposal",
    completed: false,
    dueDate: addDays(new Date(), 3),
  },
  {
    id: 2,
    title: "Review documentation",
    completed: true,
    dueDate: new Date(),
  },
];

// Add mock sensor readings
export const mockDeviceReadings: DeviceReading[] = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  deviceId: "phone_001",
  timestamp: new Date(Date.now() - (20 - i) * 60000), // Last 20 minutes of data
  data: {
    acceleration: Math.random() * 10,
    orientation: Math.random() * 360,
    motion: Math.random() > 0.5,
    screenTime: Math.floor(Math.random() * 60),
  },
}));