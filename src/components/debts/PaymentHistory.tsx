'use client';

import { useState } from 'react';
import { Box, VStack, HStack, Text, Badge, Button, Input, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { formatCurrency } from '@/lib/utils';
import { recordPayment } from '@/actions/debtRecords';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface Payment {
  id: string;
  amount: number;
  note: string | null;
  createdAt: Date;
}

interface PaymentHistoryProps {
  debtId: string;
  originalAmount: number;
  balance: number;
  status: string;
  payments: Payment[];
  onPaymentRecorded: () => void;
}

export default function PaymentHistory({
  debtId,
  originalAmount,
  balance,
  status,
  payments,
  onPaymentRecorded,
}: PaymentHistoryProps) {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;

    setLoading(true);
    setError('');
    try {
      await recordPayment(debtId, amt, payNote || undefined);
      setPayAmount('');
      setPayNote('');
      onPaymentRecorded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack align="stretch" gap={3}>
      {/* Summary */}
      <HStack gap={6}>
        <Text fontSize="sm">
          {t('debts.originalAmount' as TranslationKey)}:{' '}
          <Text as="span" fontWeight="bold">{formatCurrency(originalAmount, settings.currency)}</Text>
        </Text>
        <Text fontSize="sm">
          {t('debts.remaining' as TranslationKey)}:{' '}
          <Text as="span" fontWeight="bold" color={balance > 0 ? 'red.600' : 'green.600'}>
            {formatCurrency(balance, settings.currency)}
          </Text>
        </Text>
      </HStack>

      {/* Payment Form (only if active) */}
      {status === 'active' && (
        <Box bg="green.50" p={3} borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" mb={2}>{t('debts.recordPayment' as TranslationKey)}</Text>
          <HStack gap={2}>
            <Input
              type="number"
              size="sm"
              placeholder={t('debts.paymentAmount' as TranslationKey)}
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              w="120px"
              min={0.01}
              step={0.01}
              max={balance}
            />
            <Input
              size="sm"
              placeholder={t('debts.paymentNote' as TranslationKey)}
              value={payNote}
              onChange={(e) => setPayNote(e.target.value)}
              flex={1}
            />
            <Button
              size="sm"
              colorScheme="green"
              onClick={handlePayment}
              loading={loading}
              disabled={!payAmount || parseFloat(payAmount) <= 0}
            >
              {t('debts.recordPayment' as TranslationKey)}
            </Button>
          </HStack>
          {error && <Text color="red.500" fontSize="xs" mt={1}>{error}</Text>}
        </Box>
      )}

      {/* Payment List */}
      <Text fontSize="sm" fontWeight="medium">{t('debts.paymentHistory' as TranslationKey)}</Text>
      {payments.length === 0 ? (
        <Text fontSize="sm" color="gray.500">—</Text>
      ) : (
        <VStack align="stretch" gap={1} maxH="200px" overflowY="auto">
          {payments.map((p) => (
            <Flex key={p.id} justify="space-between" align="center" py={1.5} px={2} bg="gray.50" borderRadius="sm">
              <HStack gap={2}>
                <Text fontSize="sm" fontWeight="medium" color="green.600">
                  +{formatCurrency(p.amount, settings.currency)}
                </Text>
                {p.note && <Text fontSize="xs" color="gray.500">{p.note}</Text>}
              </HStack>
              <Text fontSize="xs" color="gray.500">
                {format(new Date(p.createdAt), 'MMM dd, yyyy HH:mm')}
              </Text>
            </Flex>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
