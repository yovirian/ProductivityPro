import { HealthMetrics } from "@/components/health/HealthMetrics";
import { StatisticsView } from "@/components/stats/StatisticsView";
import { TaskList } from "@/components/tasks/TaskList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your productivity overview for today
        </p>
      </div>

      <HealthMetrics />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks Overview</CardTitle>
            <CardDescription>Your upcoming tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <TaskList />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Your productivity trends</CardDescription>
          </CardHeader>
          <CardContent>
            <StatisticsView />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
