import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays } from "date-fns";
import type { Task } from "@shared/schema";

export function StatisticsView() {
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Calculate completed tasks per day for the last 7 days
  const taskStats = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, "yyyy-MM-dd");
    const completed = tasks?.filter(
      (task) =>
        task.completed &&
        task.dueDate &&
        format(new Date(task.dueDate), "yyyy-MM-dd") === dateStr
    ).length || 0;

    return {
      date: format(date, "MMM d"),
      completed,
    };
  }).reverse();

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={taskStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="completed"
            fill="hsl(var(--primary))"
            name="Completed Tasks"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
