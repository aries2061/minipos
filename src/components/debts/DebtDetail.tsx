'use client';

import { Box, Text, Flex, Badge, VStack } from '@chakra-ui/react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import SettleDebtButton from './SettleDebtButton';

interface SaleWithItems {
  id: string;
  totalAmount: number;
  debtorName: string | null;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    item: { name: string };
  }[];
}

interface DebtDetailProps {
  sales: SaleWithItems[];
}

export default function DebtDetail({ sales }: DebtDetailProps) {
  return (
    <VStack gap={3} align="stretch">
      {sales.map((sale) => (
        <Box key={sale.id} p={3} bg="gray.50" borderRadius="md">
          <Flex justify="space-between" align="start" mb={2}>
            <Box>
              <Text fontSize="sm" fontWeight="medium">
                {format(new Date(sale.createdAt), 'MMM dd, yyyy HH:mm')}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {sale.items.map((i) => `${i.item.name} x${i.quantity}`).join(', ')}
              </Text>
            </Box>
            <Flex gap={3} align="center">
              <Text fontWeight="semibold" fontSize="sm">{formatCurrency(sale.totalAmount)}</Text>
              {sale.isPaid ? (
                <Badge colorScheme="green">
                  Paid {sale.paidAt && format(new Date(sale.paidAt), 'MMM dd')}
                </Badge>
              ) : (
                <SettleDebtButton saleId={sale.id} />
              )}
            </Flex>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
}
