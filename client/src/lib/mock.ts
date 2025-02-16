import { addDays, subDays } from "date-fns";
import type { HealthMetric, Event, Task } from "@shared/schema";

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