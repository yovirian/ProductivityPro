
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

export const Dashboard = () => {
  const isMobile = useIsMobile();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="health">Health Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4`}>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Active Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">3</div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Daily Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">8,432</div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sleep Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">7.5</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <DeviceCard 
              name="Smart Watch"
              status="Connected"
              lastSync="2 mins ago"
              batteryLevel={85}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DeviceCard = ({ name, status, lastSync, batteryLevel }) => (
  <Card>
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className={`text-sm ${status === 'Connected' ? 'text-green-500' : 'text-red-500'}`}>
          {status}
        </p>
        <p className="text-sm text-gray-500">Last sync: {lastSync}</p>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold">{batteryLevel}%</div>
        <p className="text-sm text-gray-500">Battery</p>
      </div>
    </CardContent>
  </Card>
);
