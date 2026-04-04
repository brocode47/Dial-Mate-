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
import { MoreHorizontal, Download } from 'lucide-react';
import { type Order } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

type RecentCallsProps = {
  orders: Order[];
};

export function RecentCalls({ orders }: RecentCallsProps) {
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
                  <DropdownMenuItem>Trigger Call Again</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Confirmed</DropdownMenuItem>
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
