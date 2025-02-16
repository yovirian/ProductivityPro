import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Activity, Droplets, Moon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { HealthMetric } from "@shared/schema";

export function HealthMetrics() {
  const { data: metrics, isLoading } = useQuery<HealthMetric[]>({
    queryKey: ["/api/health-metrics"],
  });

  if (isLoading) return <div>Loading...</div>;
  if (!metrics) return null;

  const formattedData = metrics.map((metric) => ({
    ...metric,
    date: format(new Date(metric.date), "MMM d"),
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Steps</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics[0]?.steps.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Daily Goal: 10,000</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics[0]?.waterIntake}L</div>
          <p className="text-xs text-muted-foreground">Daily Goal: 8L</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sleep</CardTitle>
          <Moon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics[0]?.sleepHours}h</div>
          <p className="text-xs text-muted-foreground">Daily Goal: 8h</p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>Your activity for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="steps"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
