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

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-2xl font-semibold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Credentials</CardTitle>
          <CardDescription>
            Configure the API keys for third-party services.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shopify-key">Shopify API Key</Label>
            <Input id="shopify-key" placeholder="Enter your Shopify API key" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shopify-secret">Shopify API Secret</Label>
            <Input id="shopify-secret" placeholder="Enter your Shopify API secret" type="password" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="twilio-sid">Twilio SID</Label>
            <Input id="twilio-sid" placeholder="Enter your Twilio Account SID" type="password" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="twilio-token">Twilio Auth Token</Label>
            <Input id="twilio-token" placeholder="Enter your Twilio Auth Token" type="password" />
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
