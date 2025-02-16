import { useState } from "react";
import { DeviceManager } from "@/components/devices/DeviceManager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [autoCreateEvents, setAutoCreateEvents] = useState(true);
  const [notifyOnAutoCreate, setNotifyOnAutoCreate] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your preferences and manage devices
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar Automation</CardTitle>
          <CardDescription>
            Control how events are automatically created from notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-create">
              Automatically create events from messages and calls
            </Label>
            <Switch
              id="auto-create"
              checked={autoCreateEvents}
              onCheckedChange={setAutoCreateEvents}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notify">
              Notify me when events are automatically created
            </Label>
            <Switch
              id="notify"
              checked={notifyOnAutoCreate}
              onCheckedChange={setNotifyOnAutoCreate}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>
            Manage your connected health tracking devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceManager />
        </CardContent>
      </Card>
    </div>
  );
}
