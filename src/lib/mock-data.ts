export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  productPrice: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'No Answer';
  lastCall: string;
  productId: string;
};

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customerName: 'Ali Khan',
    customerPhone: '+92 300 1234567',
    productName: 'Designer Kurta',
    productPrice: 'PKR 2500',
    status: 'Confirmed',
    lastCall: '2024-07-29 10:30 AM',
    productId: 'prod123',
  },
  {
    id: 'ORD-002',
    customerName: 'Fatima Ahmed',
    customerPhone: '+92 321 7654321',
    productName: 'Lawn Suit',
    productPrice: 'PKR 3200',
    status: 'Pending',
    lastCall: 'Never',
    productId: 'prod124',
  },
  {
    id: 'ORD-003',
    customerName: 'Bilal Chaudhry',
    customerPhone: '+92 333 9876543',
    productName: 'Embroidered Shawl',
    productPrice: 'PKR 4500',
    status: 'Cancelled',
    lastCall: '2024-07-28 03:15 PM',
    productId: 'prod125',
  },
  {
    id: 'ORD-004',
    customerName: 'Sana Iqbal',
    customerPhone: '+92 345 1122334',
    productName: 'Leather Khussa',
    productPrice: 'PKR 1800',
    status: 'No Answer',
    lastCall: '2024-07-29 11:00 AM',
    productId: 'prod126',
  },
  {
    id: 'ORD-005',
    customerName: 'Usman Malik',
    customerPhone: '+92 312 5566778',
    productName: 'Designer Kurta',
    productPrice: 'PKR 2500',
    status: 'Pending',
    lastCall: 'Never',
    productId: 'prod123',
  },
  {
    id: 'ORD-006',
    customerName: 'Ayesha Bibi',
    customerPhone: '+92 301 8899001',
    productName: 'Chiffon Dupatta',
    productPrice: 'PKR 1200',
    status: 'Confirmed',
    lastCall: '2024-07-27 09:05 AM',
    productId: 'prod127',
  },
  {
    id: 'ORD-007',
    customerName: 'Zainab Tariq',
    customerPhone: '+92 300 1234567',
    productName: 'Designer Kurta',
    productPrice: 'PKR 2500',
    status: 'Pending',
    lastCall: 'Never',
    productId: 'prod123',
  },
];
