import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw } from "lucide-react";

export function StopwatchTimer() {
  const [mode, setMode] = useState<"stopwatch" | "timer">("stopwatch");
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [timerInput, setTimerInput] = useState("00:00:00");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (mode === "stopwatch") {
          setTime((prev) => prev + 1);
        } else {
          setTime((prev) => {
            if (prev <= 0) {
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleTimerInput = (value: string) => {
    setTimerInput(value);
    const [h = "0", m = "0", s = "0"] = value.split(":");
    const totalSeconds =
      parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
    setTime(totalSeconds);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    if (mode === "timer") {
      setTimerInput("00:00:00");
    }
  };

  return (
    <div className="space-y-8">
      <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          <TabsTrigger value="timer">Timer</TabsTrigger>
        </TabsList>
        <TabsContent value="stopwatch" className="space-y-4">
          <div className="text-6xl font-bold text-center py-8">
            {formatTime(time)}
          </div>
        </TabsContent>
        <TabsContent value="timer" className="space-y-4">
          <Input
            type="time"
            step="1"
            value={timerInput}
            onChange={(e) => handleTimerInput(e.target.value)}
            disabled={isRunning}
            className="text-4xl text-center py-8"
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
