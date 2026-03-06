'use client';

import { useState } from 'react';
import { Box, Text, Flex, Badge, Button, VStack, HStack } from '@chakra-ui/react';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import DebtDetail from './DebtDetail';

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

interface Debtor {
  debtorName: string;
  totalDebt: number;
  totalPaid: number;
  outstandingBalance: number;
  saleCount: number;
  sales: SaleWithItems[];
}

interface DebtorListProps {
  debtors: Debtor[];
}

export default function DebtorList({ debtors }: DebtorListProps) {
  const [expandedDebtor, setExpandedDebtor] = useState<string | null>(null);
  const { t } = useTranslation();
  const { settings } = useSettings();

  const totalOutstanding = debtors.reduce((sum, d) => sum + d.outstandingBalance, 0);
  const totalDebtorsCount = debtors.filter((d) => d.outstandingBalance > 0).length;

  if (debtors.length === 0) {
    return (
      <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200" textAlign="center">
        <Text color="gray.500">{t('debts.noDebtors')}</Text>
      </Box>
    );
  }

  return (
    <VStack gap={3} align="stretch">
      <HStack gap={6}>
        <Text fontSize="sm" color="gray.600">
          {t('debts.activeDebtors')} <Text as="span" fontWeight="bold">{totalDebtorsCount}</Text>
        </Text>
        <Text fontSize="sm" color="gray.600">
          {t('debts.totalOutstanding')} <Text as="span" fontWeight="bold" color="red.600">{formatCurrency(totalOutstanding, settings.currency)}</Text>
        </Text>
      </HStack>
      {debtors.map((debtor) => (
        <Box key={debtor.debtorName} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" overflow="hidden">
          <Flex
            p={4}
            justify="space-between"
            align="center"
            cursor="pointer"
            _hover={{ bg: 'gray.50' }}
            onClick={() => setExpandedDebtor(expandedDebtor === debtor.debtorName ? null : debtor.debtorName)}
          >
            <Box>
              <Text fontWeight="semibold">{debtor.debtorName}</Text>
              <Text fontSize="xs" color="gray.500">{debtor.saleCount} {t('debts.transactions')}</Text>
            </Box>
            <Flex gap={4} align="center">
              <Box textAlign="right">
                <Text fontSize="xs" color="gray.500">{t('debts.outstanding')}</Text>
                <Text fontWeight="bold" color={debtor.outstandingBalance > 0 ? 'red.600' : 'green.600'}>
                  {formatCurrency(debtor.outstandingBalance, settings.currency)}
                </Text>
              </Box>
              <Badge colorScheme={debtor.outstandingBalance > 0 ? 'red' : 'green'}>
                {debtor.outstandingBalance > 0 ? t('debts.hasDebt') : t('debts.settled')}
              </Badge>
              <Button size="xs" variant="ghost">
                {expandedDebtor === debtor.debtorName ? '▲' : '▼'}
              </Button>
            </Flex>
          </Flex>
          {expandedDebtor === debtor.debtorName && (
            <Box borderTop="1px solid" borderColor="gray.200" p={4}>
              <DebtDetail sales={debtor.sales} />
            </Box>
          )}
        </Box>
      ))}
    </VStack>
  );
}
