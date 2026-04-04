import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RecentCalls } from './components/recent-calls';
import { CheckCircle2, Clock, Phone, XCircle } from 'lucide-react';
import { mockOrders } from '@/lib/mock-data';

export default function DashboardPage() {
  const totalCalls = mockOrders.length;
  const confirmedOrders = mockOrders.filter(o => o.status === 'Confirmed').length;
  const cancelledOrders = mockOrders.filter(o => o.status === 'Cancelled').length;
  const pendingOrders = mockOrders.filter(o => o.status === 'Pending').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls Made</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <p className="text-xs text-muted-foreground">in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed Orders</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedOrders}</div>
            <p className="text-xs text-muted-foreground">
              {((confirmedOrders / totalCalls) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled Orders</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledOrders}</div>
            <p className="text-xs text-muted-foreground">
              After confirmation call
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Confirmation</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification call
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
          <CardDescription>
            An overview of the most recent order verification calls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentCalls orders={mockOrders.slice(0, 5)} />
        </CardContent>
      </Card>
    </div>
  );
}
