import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import type { Task } from "@shared/schema";

export function TaskList() {
  const [date, setDate] = useState<Date>();
  const form = useForm({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      completed: false,
      dueDate: undefined,
    },
  });

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createTask = useMutation({
    mutationFn: async (data: { title: string; completed: boolean; dueDate?: string }) => {
      await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      form.reset();
      setDate(undefined);
    },
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    createTask.mutate(data);
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Add a new task..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px]">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date);
                        field.onChange(date?.toISOString());
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={createTask.isPending}>
            {createTask.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Task
          </Button>
        </form>
      </Form>

      <div className="space-y-2">
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="flex items-center space-x-4 rounded-lg border p-4"
          >
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) =>
                toggleTask.mutate({ id: task.id, completed: !!checked })
              }
            />
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium leading-none",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </p>
              {task.dueDate && (
                <p className="text-sm text-muted-foreground">
                  Due {format(new Date(task.dueDate), "PPP")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}