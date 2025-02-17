import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Compass,
  Smartphone,
  Activity,
  Vibrate,
} from "lucide-react";
import type { DeviceReading } from "@shared/schema";

export function SensorDataView({ deviceId }: { deviceId: string }) {
  const { data: readings, isLoading } = useQuery<DeviceReading[]>({
    queryKey: [`/api/devices/${deviceId}/readings`],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) return <div>Loading sensor data...</div>;
  if (!readings?.length) return <div>No sensor data available</div>;

  const formattedData = readings.map((reading) => ({
    ...reading,
    timestamp: format(new Date(reading.timestamp), "HH:mm:ss"),
  }));

  const latestReading = readings[readings.length - 1]?.data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acceleration</CardTitle>
          <Vibrate className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestReading?.acceleration?.toFixed(2) || 'N/A'} m/s²
          </div>
          <p className="text-xs text-muted-foreground">Latest reading</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Motion</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestReading?.motion ? "Active" : "Still"}
          </div>
          <p className="text-xs text-muted-foreground">Current state</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Orientation</CardTitle>
          <Compass className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestReading?.orientation?.toFixed(0) || 'N/A'}°
          </div>
          <p className="text-xs text-muted-foreground">Current angle</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Screen Time</CardTitle>
          <Smartphone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestReading?.screenTime || 0} min
          </div>
          <p className="text-xs text-muted-foreground">Active usage</p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Sensor Activity</CardTitle>
          <CardDescription>Real-time sensor data visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="data.acceleration"
                  name="Acceleration"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="data.orientation"
                  name="Orientation"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="data.screenTime"
                  name="Screen Time"
                  stroke="hsl(var(--secondary))"
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