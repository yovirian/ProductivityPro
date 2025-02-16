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
        description: "Your browser doesn't support Bluetooth connectivity.",
        variant: "destructive",
      });
      return null;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['health_thermometer'] },
          { services: ['heart_rate'] },
          { services: ['battery_service'] }
        ],
        optionalServices: ['device_information']
      });

      device.addEventListener('gattserverdisconnected', () => {
        this.handleDisconnection(device);
      });

      return device;
    } catch (error) {
      console.error('Error requesting BLE device:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the device. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }

  private handleDisconnection(device: BluetoothDevice) {
    this.connectedDevices.delete(device.id);
    toast({
      title: "Device Disconnected",
      description: `${device.name || 'Device'} has been disconnected`,
      variant: "default",
    });
  }

  async connectToDevice(device: BluetoothDevice): Promise<boolean> {
    try {
      const server = await device.gatt?.connect();
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
        description: "Failed to establish connection with the device",
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
    return this.connectedDevices.has(deviceId);
  }
}

export const bleService = new BLEService();
