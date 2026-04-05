'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Download, Phone } from 'lucide-react';
import { type Order } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type RecentCallsProps = {
  orders: Order[];
};

export function RecentCalls({ orders: initialOrders }: RecentCallsProps) {
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);


  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      case 'No Answer':
        return 'outline';
      default:
        return 'default';
    }
  };

  const handleTriggerCall = (orderId: string) => {
    toast({
      title: 'Call Simulation Triggered',
      description: `Initiating a verification call for order ${orderId}.`,
    });
  };

  const handleMarkAsConfirmed = (orderId: string) => {
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, status: 'Confirmed' } : order
      )
    );
    toast({
      title: 'Order Status Updated',
      description: `Order ${orderId} has been marked as Confirmed.`,
      className: 'bg-green-100 dark:bg-green-900',
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Product</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Last Call</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              <Link
                href={`/dashboard/order/${order.id}`}
                className="hover:underline"
              >
                {order.id}
              </Link>
            </TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{order.productName}</TableCell>
            <TableCell className="text-center">
              <Badge
                variant={getStatusVariant(order.status)}
                className={cn(order.status === 'Confirmed' && 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
                'capitalize')}
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{order.lastCall}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/order/${order.id}`}>View Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleTriggerCall(order.id)}>
                    <Phone className="mr-2 h-4 w-4" />
                    <span>Trigger Call Again</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMarkAsConfirmed(order.id)}>Mark as Confirmed</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download Summary</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
