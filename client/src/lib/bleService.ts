declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
    };
  }

  interface RequestDeviceOptions {
    filters: Array<{
      services?: string[];
      name?: string;
      namePrefix?: string;
      manufacturerId?: number;
    }>;
    optionalServices?: string[];
    acceptAllDevices?: boolean;
  }

  interface BluetoothDevice {
    id: string;
    name: string | null;
    gatt?: {
      connect(): Promise<BluetoothRemoteGATTServer>;
    };
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface BluetoothRemoteGATTServer {
    device: BluetoothDevice;
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  }

  interface BluetoothRemoteGATTService {
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    readValue(): Promise<DataView>;
  }
}

import { toast } from "@/hooks/use-toast";

interface DeviceEntry {
  device: BluetoothDevice;
  server: BluetoothRemoteGATTServer;
}

class BLEService {
  private connectedDevices: Map<string, DeviceEntry>;

  constructor() {
    this.connectedDevices = new Map();
  }

  async requestDevice(): Promise<BluetoothDevice | null> {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['health_thermometer'] },
          { services: ['heart_rate'] },
          { services: ['battery_service'] }
        ],
        optionalServices: ['generic_access', 'device_information']
      });

      device.addEventListener('gattserverdisconnected', () => this.handleDisconnection(device));

      toast({
        title: "Device Found",
        description: `Found ${device.name || 'device'}. Attempting to connect...`,
      });

      return device;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User cancelled')) {
          toast({
            title: "Scan Cancelled",
            description: "Please keep Bluetooth enabled and try again when ready.",
          });
        } else {
          toast({
            title: "Connection Failed",
            description: "Make sure Bluetooth is enabled on your phone and try again.",
            variant: "destructive",
          });
        }
      }
      return null;
    }
  }

  private handleDisconnection(device: BluetoothDevice) {
    this.connectedDevices.delete(device.id);
    toast({
      title: "Device Disconnected",
      description: `${device.name || 'Device'} was disconnected. Tap 'Scan BLE Device' to reconnect.`,
    });
  }

  async connectToDevice(device: BluetoothDevice): Promise<boolean> {
    try {
      if (!device.gatt) {
        throw new Error("Bluetooth not supported on this device");
      }

      const server = await device.gatt.connect();

      if (!server) {
        throw new Error("Could not establish connection");
      }

      this.connectedDevices.set(device.id, { device, server });

      // Try to get device info
      try {
        const service = await server.getPrimaryService('device_information');
        const characteristic = await service.getCharacteristic('manufacturer_name_string');
        const value = await characteristic.readValue();
        const manufacturer = new TextDecoder().decode(value);

        toast({
          title: "Connected Successfully",
          description: `Connected to ${device.name || 'device'} (${manufacturer})`,
        });
      } catch (e) {
        // Device info not available, show simple success message
        toast({
          title: "Connected Successfully",
          description: `Connected to ${device.name || 'device'}`,
        });
      }

      return true;
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Make sure your phone's Bluetooth is on and nearby.",
        variant: "destructive",
      });
      return false;
    }
  }

  isConnected(deviceId: string): boolean {
    return this.connectedDevices.get(deviceId)?.server?.connected || false;
  }
}

export const bleService = new BLEService();