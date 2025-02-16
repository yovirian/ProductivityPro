import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Plus, Loader2, SmartphoneNfc, Wifi, WifiOff, Bluetooth } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { bleService } from "@/lib/bleService";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDeviceSchema } from "@shared/schema";
import type { Device } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function DeviceManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { toast } = useToast();
  const [isScanningBLE, setIsScanningBLE] = useState(false);

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
      const wsUrl = `${protocol}//${window.location.host}/ws/devices`;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log('WebSocket connected');
        setWsStatus('connected');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "new_reading") {
            queryClient.invalidateQueries({ queryKey: [`/api/devices/${data.payload.deviceId}/readings`] });
          }
        } catch (error) {
          console.error("WebSocket message error:", error);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsStatus('disconnected');
        setTimeout(connect, 5000);
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setWsStatus('disconnected');
        setTimeout(connect, 5000);
      };

      setWs(socket);
    }

    connect();

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

  const handleBLEScan = async () => {
    setIsScanningBLE(true);
    try {
      const device = await bleService.requestDevice();
      if (device) {
        const connected = await bleService.connectToDevice(device);
        if (connected) {
          // Add the BLE device to our system
          const deviceData = {
            deviceId: device.id,
            deviceType: 'ble_device',
            name: device.name || 'BLE Device',
            metadata: {
              bleId: device.id,
              connectionType: 'ble'
            }
          };
          addDevice.mutate(deviceData);
        }
      }
    } catch (error) {
      console.error('BLE scan error:', error);
      toast({
        title: "BLE Scan Failed",
        description: "Failed to scan for BLE devices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanningBLE(false);
    }
  };

  const onSubmit = form.handleSubmit((data) => {
    addDevice.mutate(data);
  });

  const connectionUrl = `${window.location.protocol}//${window.location.host}/connect`;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Connected Devices</h2>
          {wsStatus === 'connected' ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBLEScan}
            disabled={isScanningBLE}
          >
            {isScanningBLE ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Bluetooth className="h-4 w-4 mr-2" />
            )}
            Scan BLE Device
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Connect New Device</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6">
                <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-center text-muted-foreground">
                    Scan this QR code with your smartphone to connect it to the application
                  </p>
                  <QRCodeSVG
                    value={connectionUrl}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or add manually
                    </span>
                  </div>
                </div>
                <Form {...form}>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="deviceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device ID</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., smartwatch_001, scale_001"
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground">
                            Enter a unique identifier for your device
                          </p>
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
                            <Input {...field} placeholder="e.g., My iPhone" />
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
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices?.map((device) => (
          <Card key={device.deviceId}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                {device.metadata?.connectionType === 'ble' ? (
                  <Bluetooth className="h-5 w-5 text-primary" />
                ) : (
                  <SmartphoneNfc className="h-5 w-5 text-primary" />
                )}
                {device.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Type: {device.deviceType}
              </p>
              <p className="text-sm text-muted-foreground">
                Connection: {device.metadata?.connectionType === 'ble' ? 'Bluetooth LE' : 'WiFi'}
              </p>
              <p className="text-sm text-muted-foreground">
                Last Sync: {device.lastSync ? format(new Date(device.lastSync), "PPp") : "Never"}
              </p>
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Handle device management
                  }}
                >
                  Manage Device
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}