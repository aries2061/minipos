'use client';

import { Box, Badge, Text } from '@chakra-ui/react';
import DataTable from '@/components/ui/DataTable';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n';

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
  const { t } = useTranslation();
  const paymentLabels: Record<string, string> = { cash: t('sales.cash'), digital: t('sales.digital'), debt: t('sales.debt') };

  const columns = [
    {
      header: t('table.date'),
      accessor: (row: SaleWithItems) => format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm'),
    },
    {
      header: t('table.items'),
      accessor: (row: SaleWithItems) => (
        <Text fontSize="xs">
          {row.items.map((i) => `${i.item.name} x${i.quantity}`).join(', ')}
        </Text>
      ),
    },
    {
      header: t('table.total'),
      accessor: (row: SaleWithItems) => formatCurrency(row.totalAmount),
    },
    {
      header: t('table.payment'),
      accessor: (row: SaleWithItems) => (
        <Badge
          colorScheme={row.paymentMode === 'cash' ? 'green' : row.paymentMode === 'digital' ? 'blue' : 'orange'}
        >
          {paymentLabels[row.paymentMode] || row.paymentMode}
        </Badge>
      ),
    },
    {
      header: t('table.debtor'),
      accessor: (row: SaleWithItems) => row.debtorName || '-',
    },
    {
      header: t('table.status'),
      accessor: (row: SaleWithItems) =>
        row.isDebt ? (
          <Badge colorScheme={row.isPaid ? 'green' : 'red'}>
            {row.isPaid ? t('sales.paid') : t('sales.unpaid')}
          </Badge>
        ) : (
          <Badge colorScheme="green">{t('sales.completed')}</Badge>
        ),
    },
  ];

  return (
    <Box>
      <DataTable columns={columns} data={sales} emptyMessage={t('sales.emptyMessage')} />
    </Box>
  );
}
