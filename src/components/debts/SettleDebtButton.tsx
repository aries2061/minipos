'use client';

import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { settleDebt } from '@/actions/debts';

interface SettleDebtButtonProps {
  saleId: string;
}

export default function SettleDebtButton({ saleId }: SettleDebtButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSettle = async () => {
    if (!confirm('Mark this debt as paid?')) return;
    setLoading(true);
    try {
      await settleDebt(saleId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="xs" colorScheme="green" onClick={handleSettle} loading={loading}>
      Mark Paid
    </Button>
  );
}
