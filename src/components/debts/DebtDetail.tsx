'use client';

import { Box, Text, Flex, Badge, VStack } from '@chakra-ui/react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import SettleDebtButton from './SettleDebtButton';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface SaleWithItems {
  id: string;
  totalAmount: number;
  debtorName: string | null;
  isPaid: boolean;
  paidAmount: number;
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
  const { t } = useTranslation();
  const { settings } = useSettings();
  return (
    <VStack gap={3} align="stretch">
      {sales.map((sale) => {
        const remaining = sale.totalAmount - sale.paidAmount;
        return (
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
                <Box textAlign="right">
                  <Text fontWeight="semibold" fontSize="sm">{formatCurrency(sale.totalAmount, settings.currency)}</Text>
                  {sale.paidAmount > 0 && !sale.isPaid && (
                    <Text fontSize="xs" color="green.600">
                      {t('debts.paid' as TranslationKey)}: {formatCurrency(sale.paidAmount, settings.currency)} | {t('debts.remaining' as TranslationKey)}: {formatCurrency(remaining, settings.currency)}
                    </Text>
                  )}
                </Box>
                {sale.isPaid ? (
                  <Badge colorScheme="green">
                    {t('debts.paid')} {sale.paidAt && format(new Date(sale.paidAt), 'MMM dd')}
                  </Badge>
                ) : (
                  <SettleDebtButton saleId={sale.id} totalAmount={sale.totalAmount} paidAmount={sale.paidAmount} />
                )}
              </Flex>
            </Flex>
          </Box>
        );
      })}
    </VStack>
  );
}
