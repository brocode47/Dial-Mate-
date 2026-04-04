import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Bot, PhoneOutgoing, Save } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-semibold">Settings</h1>
        <Button>
          <Save className="mr-2" /> Save All Settings
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot /> AI Agent Configuration
            </CardTitle>
            <CardDescription>
              Customize the behavior of your AI calling agent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ai-voice">AI Voice</Label>
              <Select defaultValue="algenib">
                <SelectTrigger id="ai-voice">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="algenib">Algenib (Neutral)</SelectItem>
                  <SelectItem value="achernar">Achernar (Male)</SelectItem>
                  <SelectItem value="canopus">Canopus (Female)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Auto-summarize calls</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically generate a summary after each call ends.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label>Enable Call Recording</Label>
                <p className="text-xs text-muted-foreground">
                  Simulate call recording for review (no real audio stored).
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PhoneOutgoing /> Call Scripts
            </CardTitle>
            <CardDescription>
              Define the templates for what the AI agent will say.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="confirmation">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
                <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
              </TabsList>
              <TabsContent value="confirmation" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="confirmation-script">
                    Order Confirmation Script
                  </Label>
                  <Textarea
                    id="confirmation-script"
                    placeholder="Enter your script here..."
                    rows={6}
                    defaultValue="Assalamualaikum! Kya main {customerName} se baat kar raha hoon? Aap ne hamari website se {productName} order kiya tha, jiski price {productPrice} hai. Kya aap apna order confirm karte hain?"
                  />
                   <p className="text-xs text-muted-foreground">
                    Use {'{customerName}'}, {'{productName}'}, and {'{productPrice}'} as placeholders.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="cancellation" className="mt-4">
                <div className="space-y-2">
                  <Label htmlFor="cancellation-script">
                    Order Cancellation Script
                  </Label>
                  <Textarea
                    id="cancellation-script"
                    placeholder="Enter cancellation script..."
                    rows={6}
                     defaultValue="Assalamualaikum {customerName}. Aap ka order {orderId} cancel kar diya gaya hai. Mazeed maloomat ke liye hamari website visit karein."
                  />
                   <p className="text-xs text-muted-foreground">
                    Use {'{customerName}'} and {'{orderId}'} as placeholders.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
          <CardDescription>
            Configure the API keys for third-party services. These are not functional in sandbox mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shopify-key">Shopify API Key</Label>
              <Input
                id="shopify-key"
                placeholder="shpat_..."
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopify-secret">Shopify API Secret</Label>
              <Input
                id="shopify-secret"
                placeholder="shpss_..."
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twilio-sid">Twilio Account SID</Label>
              <Input id="twilio-sid" placeholder="AC..." type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twilio-token">Twilio Auth Token</Label>
              <Input
                id="twilio-token"
                placeholder="Your auth token"
                type="password"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
