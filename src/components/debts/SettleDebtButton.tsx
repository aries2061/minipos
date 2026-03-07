'use client';

import { useState } from 'react';
import { Box, Button, HStack, Input, Text } from '@chakra-ui/react';
import { settleDebt, recordSalePayment } from '@/actions/debts';
import { useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { formatCurrency } from '@/lib/utils';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface SettleDebtButtonProps {
  saleId: string;
  totalAmount: number;
  paidAmount: number;
}

export default function SettleDebtButton({ saleId, totalAmount, paidAmount }: SettleDebtButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { settings } = useSettings();

  const remaining = totalAmount - paidAmount;

  const handleFullPay = async () => {
    if (!confirm(t('debts.markPaidConfirm'))) return;
    setLoading(true);
    try {
      await settleDebt(saleId);
    } finally {
      setLoading(false);
    }
  };

  const handlePartialPay = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setLoading(true);
    try {
      await recordSalePayment(saleId, amt);
      setAmount('');
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <HStack gap={1}>
        <Button size="xs" colorScheme="green" onClick={handleFullPay} loading={loading}>
          {t('debts.markPaid')}
        </Button>
        <Button size="xs" colorScheme="blue" variant="outline" onClick={() => setShowForm(true)}>
          {t('debts.partialPay' as TranslationKey)}
        </Button>
      </HStack>
    );
  }

  return (
    <Box>
      <Text fontSize="xs" color="gray.500" mb={1}>
        {t('debts.remaining' as TranslationKey)}: {formatCurrency(remaining, settings.currency)}
      </Text>
      <HStack gap={1}>
        <Input
          type="number"
          size="xs"
          w="90px"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t('debts.paymentAmount' as TranslationKey)}
          min={0.01}
          step={0.01}
          max={remaining}
        />
        <Button size="xs" colorScheme="green" onClick={handlePartialPay} loading={loading} disabled={!amount || parseFloat(amount) <= 0}>
          {t('debts.recordPayment' as TranslationKey)}
        </Button>
        <Button size="xs" variant="ghost" onClick={() => setShowForm(false)}>
          {t('action.cancel')}
        </Button>
      </HStack>
    </Box>
  );
}
