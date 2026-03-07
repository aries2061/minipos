'use client';

import { useState } from 'react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import { createDebt } from '@/actions/debtRecords';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface Customer {
  id: string;
  name: string;
  phone: string | null;
}

interface DebtRecordFormProps {
  customers: Customer[];
  onClose: () => void;
}

export default function DebtRecordForm({ customers, onClose }: DebtRecordFormProps) {
  const { t } = useTranslation();
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !amount) return;

    setLoading(true);
    setError('');
    try {
      await createDebt(customerId, parseFloat(amount), note || undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create debt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200" mb={4}>
      <Text fontWeight="semibold" mb={3}>{t('debts.addDebt' as TranslationKey)}</Text>
      <form onSubmit={handleSubmit}>
        <VStack gap={3} align="stretch">
          <Box>
            <Text fontSize="sm" mb={1}>{t('debts.customer' as TranslationKey)} *</Text>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                fontSize: '14px',
              }}
            >
              <option value="">{t('debts.selectCustomer' as TranslationKey)}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.phone ? ` (${c.phone})` : ''}
                </option>
              ))}
            </select>
          </Box>
          <Box>
            <Text fontSize="sm" mb={1}>{t('debts.amount' as TranslationKey)} *</Text>
            <Input
              type="number"
              size="sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0.01}
              step={0.01}
            />
          </Box>
          <Box>
            <Text fontSize="sm" mb={1}>{t('debts.note' as TranslationKey)}</Text>
            <Input
              size="sm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t('debts.paymentNote' as TranslationKey)}
            />
          </Box>
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          <Box display="flex" gap={2}>
            <Button type="submit" size="sm" colorScheme="blue" loading={loading} disabled={!customerId || !amount}>
              {t('action.create')}
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              {t('action.cancel')}
            </Button>
          </Box>
        </VStack>
      </form>
    </Box>
  );
}
