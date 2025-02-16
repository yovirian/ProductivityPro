import { StopwatchTimer } from "@/components/timer/StopwatchTimer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Timer() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timer</h1>
        <p className="text-muted-foreground">
          Track your time and stay focused
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stopwatch & Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <StopwatchTimer />
        </CardContent>
      </Card>
    </div>
  );
}
