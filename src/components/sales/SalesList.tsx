'use client';

import { Box, Badge, Text } from '@chakra-ui/react';
import DataTable from '@/components/ui/DataTable';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface SaleWithItems {
  id: string;
  totalAmount: number;
  costTotal: number;
  paymentMode: string;
  isDebt: boolean;
  debtorName: string | null;
  isPaid: boolean;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    item: { name: string };
  }[];
}

interface SalesListProps {
  sales: SaleWithItems[];
}

export default function SalesList({ sales }: SalesListProps) {
  const columns = [
    {
      header: 'Date',
      accessor: (row: SaleWithItems) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
    {
      header: 'Items',
      accessor: (row: SaleWithItems) => (
        <Text fontSize="xs">
          {row.items.map((i) => `${i.item.name} x${i.quantity}`).join(', ')}
        </Text>
      ),
    },
    {
      header: 'Total',
      accessor: (row: SaleWithItems) => formatCurrency(row.totalAmount),
    },
    {
      header: 'Payment',
      accessor: (row: SaleWithItems) => (
        <Badge
          colorScheme={row.paymentMode === 'cash' ? 'green' : row.paymentMode === 'digital' ? 'blue' : 'orange'}
        >
          {row.paymentMode}
        </Badge>
      ),
    },
    {
      header: 'Debtor',
      accessor: (row: SaleWithItems) => row.debtorName || '-',
    },
    {
      header: 'Status',
      accessor: (row: SaleWithItems) =>
        row.isDebt ? (
          <Badge colorScheme={row.isPaid ? 'green' : 'red'}>
            {row.isPaid ? 'Paid' : 'Unpaid'}
          </Badge>
        ) : (
          <Badge colorScheme="green">Completed</Badge>
        ),
    },
  ];

  return (
    <Box>
      <DataTable columns={columns} data={sales} emptyMessage="No sales recorded yet." />
    </Box>
  );
}
