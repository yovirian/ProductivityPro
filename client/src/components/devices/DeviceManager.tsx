import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Loader2, SmartphoneNfc } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDeviceSchema } from "@shared/schema";
import type { Device } from "@shared/schema";

export function DeviceManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const form = useForm({
    resolver: zodResolver(insertDeviceSchema),
    defaultValues: {
      deviceId: "",
      deviceType: "",
      name: "",
      metadata: {},
    },
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/devices`; // Use dedicated path
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "new_reading") {
            // Update device readings in real-time
            queryClient.invalidateQueries({ queryKey: [`/api/devices/${data.payload.deviceId}/readings`] });
          }
        } catch (error) {
          console.error("WebSocket message error:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Attempt to reconnect after error
        setTimeout(connect, 5000);
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after close
        setTimeout(connect, 5000);
      };

      setWs(socket);
    }

    connect(); // Initial connection

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ["/api/devices"],
  });

  const addDevice = useMutation({
    mutationFn: async (data: { deviceId: string; deviceType: string; name: string; metadata: Record<string, unknown> }) => {
      await apiRequest("POST", "/api/devices", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      form.reset();
      setIsOpen(false);
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    addDevice.mutate(data);
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Connected Devices</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="smartwatch">Smartwatch</SelectItem>
                          <SelectItem value="scale">Smart Scale</SelectItem>
                          <SelectItem value="phone">Smartphone</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={addDevice.isPending}>
                  {addDevice.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Device
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices?.map((device) => (
          <div
            key={device.deviceId}
            className="rounded-lg border p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <SmartphoneNfc className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{device.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Type: {device.deviceType}
            </p>
            <p className="text-sm text-muted-foreground">
              Last Sync: {device.lastSync ? format(new Date(device.lastSync), "PPp") : "Never"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}