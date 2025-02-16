import { apiRequest } from "./queryClient";
import type { InsertEvent } from "@shared/schema";

interface NotificationData {
  type: "call" | "message";
  content: string;
  timestamp: string;
  sender?: string;
}

export async function parseNotificationToEvent(notification: NotificationData): Promise<void> {
  let title = "";
  let description: string | null = "";
  let start = new Date(notification.timestamp);
  let end = new Date(start);
  end.setHours(end.getHours() + 1); // Default duration: 1 hour

  if (notification.type === "call") {
    title = `Call with ${notification.sender || "Unknown"}`;
    description = `Phone call received at ${start.toLocaleTimeString()}`;
  } else if (notification.type === "message") {
    // Basic parsing for time-related keywords
    const content = notification.content.toLowerCase();

    // Extract potential meeting information
    if (content.includes("meeting") || content.includes("call") || content.includes("appointment")) {
      title = `Meeting: ${notification.sender}`;

      // Try to find time information
      const timeMatch = content.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
      if (timeMatch) {
        const timeStr = timeMatch[1];
        // Parse the time and set it in the start date
        const parsedTime = new Date(`${start.toDateString()} ${timeStr}`);
        if (!isNaN(parsedTime.getTime())) {
          start = parsedTime;
          end = new Date(start);
          end.setHours(end.getHours() + 1);
        }
      }
    } else {
      // Not enough information to create an event
      return;
    }

    description = notification.content;
  }

  // Create the event
  const event: InsertEvent = {
    title,
    description,
    start,
    end,
  };

  try {
    await apiRequest("POST", "/api/events", event);
  } catch (error) {
    console.error("Failed to create event from notification:", error);
  }
}