
import { SmartphoneNfc, CheckCircle2, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { bleService } from "@/lib/bleService";

export function ConnectPage() {
  const { toast } = useToast();

  const handleConnection = async () => {
    try {
      // Try Bluetooth first
      if ('bluetooth' in navigator) {
        const device = await bleService.requestDevice();
        if (device) {
          toast({
            title: "Device Found",
            description: "Connecting to " + (device.name || "device") + "...",
          });
          const connected = await bleService.connectToDevice(device);
          if (connected) {
            toast({
              title: "Success",
              description: "Device connected successfully!",
            });
            window.location.href = '/dashboard';
            return;
          }
        }
      }

      // Fallback to WiFi connection
      toast({
        title: "Starting WiFi Connection",
        description: "Please make sure you're on the same network",
      });
      window.location.href = `${window.location.origin}/connect/wifi`;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again or use a different connection method",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <SmartphoneNfc className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Connect Your Device</h1>
        <p className="text-muted-foreground">
          Seamlessly sync your smartphone with our platform
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Automatic Syncing</h3>
                <p className="text-sm text-muted-foreground">
                  Your data syncs automatically in real-time. No manual uploads needed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button 
        className="w-full" 
        size="lg"
        onClick={handleConnection}
      >
        Start Connection Process
      </Button>

      <p className="text-sm text-center text-muted-foreground mt-4">
        Make sure Bluetooth is enabled or you're connected to the same WiFi network
      </p>
    </div>
  );
}
