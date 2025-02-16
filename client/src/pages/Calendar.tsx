import { CalendarView } from "@/components/calendar/CalendarView";

export default function Calendar() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          Schedule and manage your events
        </p>
      </div>

      <CalendarView />
    </div>
  );
}
