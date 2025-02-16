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

export type BLEDevice = {
  device: BluetoothDevice;
  server?: BluetoothRemoteGATTServer;
};

class BLEService {
  private connectedDevices: Map<string, BLEDevice> = new Map();

  async requestDevice(): Promise<BluetoothDevice | null> {
    if (!navigator.bluetooth) {
      toast({
        title: "Bluetooth Not Supported",
        description: "Your browser doesn't support Bluetooth connectivity. Please use a modern browser like Chrome.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { namePrefix: 'SmartWatch' },
          { namePrefix: 'SmartScale' },
          { namePrefix: 'FitnessTracker' }
        ],
        optionalServices: [
          'battery_service',
          'health_thermometer',
          'heart_rate',
          'device_information'
        ]
      });

      if (!device) {
        throw new Error("No device selected");
      }

      device.addEventListener('gattserverdisconnected', () => {
        this.handleDisconnection(device);
      });

      return device;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User cancelled')) {
          toast({
            title: "Scan Cancelled",
            description: "Device scanning was cancelled. Please try again when ready.",
            variant: "default",
          });
        } else {
          console.error('Error requesting BLE device:', error);
          toast({
            title: "Connection Failed",
            description: "Failed to connect to the device. Please ensure Bluetooth is enabled and try again.",
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
      description: `${device.name || 'Device'} has been disconnected. Please try reconnecting if needed.`,
      variant: "default",
    });
  }

  async connectToDevice(device: BluetoothDevice): Promise<boolean> {
    try {
      if (!device.gatt) {
        throw new Error("Device does not support GATT");
      }

      const server = await device.gatt.connect();
      if (!server) {
        throw new Error("Failed to connect to GATT server");
      }

      this.connectedDevices.set(device.id, { device, server });

      toast({
        title: "Device Connected",
        description: `Successfully connected to ${device.name || 'device'}`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error connecting to device:', error);
      toast({
        title: "Connection Error",
        description: error instanceof Error 
          ? `Failed to connect: ${error.message}`
          : "Failed to establish connection with the device. Please ensure the device is nearby and powered on.",
        variant: "destructive",
      });
      return false;
    }
  }

  async disconnectDevice(deviceId: string) {
    const deviceEntry = this.connectedDevices.get(deviceId);
    if (deviceEntry) {
      deviceEntry.server?.disconnect();
      this.connectedDevices.delete(deviceId);
      toast({
        title: "Device Disconnected",
        description: "Device has been successfully disconnected.",
        variant: "default",
      });
    }
  }

  async getDeviceBatteryLevel(deviceId: string): Promise<number | null> {
    const deviceEntry = this.connectedDevices.get(deviceId);
    if (!deviceEntry?.server) return null;

    try {
      const service = await deviceEntry.server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const value = await characteristic.readValue();
      return value.getUint8(0);
    } catch (error) {
      console.error('Error reading battery level:', error);
      return null;
    }
  }

  isConnected(deviceId: string): boolean {
    const device = this.connectedDevices.get(deviceId);
    return device?.server?.connected || false;
  }
}

export const bleService = new BLEService();