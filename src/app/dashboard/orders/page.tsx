import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RecentCalls } from '../components/recent-calls';
import { mockOrders } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
         <h1 className="font-headline text-2xl font-semibold">All Orders</h1>
         <div className="flex items-center gap-2">
            <Input placeholder="Search orders..." className="w-64" />
            <Button variant="outline"><Search className="mr-2 h-4 w-4" /> Search</Button>
         </div>
       </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            A complete log of all orders and their verification status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentCalls orders={mockOrders} />
        </CardContent>
      </Card>
    </div>
  );
}
