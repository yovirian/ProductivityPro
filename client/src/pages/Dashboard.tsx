import { useQuery } from "@tanstack/react-query";
import { HealthMetrics } from "@/components/health/HealthMetrics";
import { StatisticsView } from "@/components/stats/StatisticsView";
import { TaskList } from "@/components/tasks/TaskList";
import { SensorDataView } from "@/components/sensors/SensorDataView";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Device } from "@shared/schema";

export default function Dashboard() {
  const { data: devices } = useQuery<Device[]>({
    queryKey: ["/api/devices"],
  });

  // Find the first connected smartphone device
  const activePhone = devices?.find(
    (device) => device.deviceType === "phone" && device.lastSync
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your productivity overview for today
        </p>
      </div>

      <HealthMetrics />

      {activePhone && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Device Sensors</h2>
          <SensorDataView deviceId={activePhone.deviceId} />
        </div>
      )}

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