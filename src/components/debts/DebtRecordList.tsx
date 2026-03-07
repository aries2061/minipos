'use client';

import { useState, useEffect } from 'react';
import { Box, VStack, Text, Flex, Badge, Button, HStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { formatCurrency } from '@/lib/utils';
import { getDebts, deleteDebt } from '@/actions/debtRecords';
import { getCustomersList } from '@/actions/customers';
import DebtRecordForm from './DebtRecordForm';
import PaymentHistory from './PaymentHistory';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface Customer {
  id: string;
  name: string;
  phone: string | null;
}

interface Payment {
  id: string;
  amount: number;
  note: string | null;
  createdAt: Date;
}

interface DebtRecord {
  id: string;
  amount: number;
  balance: number;
  note: string | null;
  status: string;
  createdAt: Date;
  customer: { id: string; name: string; phone: string | null };
  payments: Payment[];
}

interface DebtRecordListProps {
  initialDebts: DebtRecord[];
  search?: string;
}

export default function DebtRecordList({ initialDebts, search }: DebtRecordListProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [debts, setDebts] = useState<DebtRecord[]>(initialDebts);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);

  useEffect(() => {
    setDebts(initialDebts);
  }, [initialDebts]);

  const loadCustomers = async () => {
    const list = await getCustomersList();
    setCustomers(list);
  };

  const refresh = async () => {
    const data = await getDebts(search);
    setDebts(data);
  };

  const handleShowForm = async () => {
    await loadCustomers();
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('debts.deleteDebtConfirm' as TranslationKey))) return;
    await deleteDebt(id);
    await refresh();
  };

  const totalOutstanding = debts.reduce((sum, d) => sum + d.balance, 0);
  const activeCount = debts.filter((d) => d.status === 'active').length;

  return (
    <VStack gap={3} align="stretch">
      {showForm ? (
        <DebtRecordForm
          customers={customers}
          onClose={() => {
            setShowForm(false);
            refresh();
          }}
        />
      ) : (
        <Box mb={2}>
          <Button size="sm" colorScheme="blue" onClick={handleShowForm}>
            {t('debts.addDebt' as TranslationKey)}
          </Button>
        </Box>
      )}

      {debts.length > 0 && (
        <HStack gap={6} mb={2}>
          <Text fontSize="sm" color="gray.600">
            {t('debts.activeDebtors')} <Text as="span" fontWeight="bold">{activeCount}</Text>
          </Text>
          <Text fontSize="sm" color="gray.600">
            {t('debts.totalOutstanding')} <Text as="span" fontWeight="bold" color="red.600">{formatCurrency(totalOutstanding, settings.currency)}</Text>
          </Text>
        </HStack>
      )}

      {debts.length === 0 ? (
        <Box bg="white" p={8} borderRadius="lg" border="1px solid" borderColor="gray.200" textAlign="center">
          <Text color="gray.500">{t('debts.noDebts' as TranslationKey)}</Text>
        </Box>
      ) : (
        debts.map((debt) => (
          <Box key={debt.id} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" overflow="hidden">
            <Flex
              p={4}
              justify="space-between"
              align="center"
              cursor="pointer"
              _hover={{ bg: 'gray.50' }}
              onClick={() => setExpandedDebtId(expandedDebtId === debt.id ? null : debt.id)}
            >
              <Box>
                <Text fontWeight="semibold">{debt.customer.name}</Text>
                <Text fontSize="xs" color="gray.500">
                  {debt.customer.phone || '—'} · {format(new Date(debt.createdAt), 'MMM dd, yyyy')}
                  {debt.note && ` · ${debt.note}`}
                </Text>
              </Box>
              <Flex gap={4} align="center">
                <Box textAlign="right">
                  <Text fontSize="xs" color="gray.500">{t('debts.balance' as TranslationKey)}</Text>
                  <Text fontWeight="bold" color={debt.balance > 0 ? 'red.600' : 'green.600'}>
                    {formatCurrency(debt.balance, settings.currency)}
                  </Text>
                </Box>
                <Badge colorScheme={debt.status === 'active' ? 'orange' : 'green'}>
                  {debt.status === 'active' ? t('debts.active' as TranslationKey) : t('debts.settled')}
                </Badge>
                <Button
                  size="xs"
                  colorScheme="red"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(debt.id);
                  }}
                >
                  {t('debts.deleteDebt' as TranslationKey)}
                </Button>
                <Button size="xs" variant="ghost">
                  {expandedDebtId === debt.id ? '▲' : '▼'}
                </Button>
              </Flex>
            </Flex>
            {expandedDebtId === debt.id && (
              <Box borderTop="1px solid" borderColor="gray.200" p={4}>
                <PaymentHistory
                  debtId={debt.id}
                  originalAmount={debt.amount}
                  balance={debt.balance}
                  status={debt.status}
                  payments={debt.payments}
                  onPaymentRecorded={refresh}
                />
              </Box>
            )}
          </Box>
        ))
      )}
    </VStack>
  );
}
