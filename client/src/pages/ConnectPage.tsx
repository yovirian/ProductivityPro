import { SmartphoneNfc, CheckCircle2, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ConnectPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <SmartphoneNfc className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Connect Your Device</h1>
        <p className="text-muted-foreground">
          Seamlessly sync your smartphone with our productivity platform
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
                  Your data syncs automatically in real-time. No manual uploads or complicated setup required.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Secure Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted end-to-end and transmitted securely over your local WiFi network.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Zap className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Instant Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Get immediate access to health tracking, calendar syncing, and productivity features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button 
        className="w-full" 
        size="lg"
        onClick={() => {
          // This will be replaced with actual WiFi discovery code
          if ('NDEFReader' in window) {
            navigator.mediaDevices.getUserMedia({ audio: false, video: false })
              .then(() => {
                // Start WiFi discovery process
                window.location.href = `${window.location.origin}/api/connect/wifi`;
              })
              .catch(console.error);
          } else {
            alert('Your device does not support the required features for WiFi sync.');
          }
        }}
      >
        Start Connection Process
      </Button>

      <p className="text-sm text-center text-muted-foreground mt-4">
        Make sure you're connected to the same WiFi network as your computer
      </p>
    </div>
  );
}
