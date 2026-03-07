'use client';

import { useState } from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface DebtTabsProps {
  saleDebtsContent: React.ReactNode;
  debtRecordsContent: React.ReactNode;
}

export default function DebtTabs({ saleDebtsContent, debtRecordsContent }: DebtTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'sale' | 'records'>('records');

  return (
    <Box>
      <HStack gap={2} mb={4}>
        <Button
          size="sm"
          variant={activeTab === 'records' ? 'solid' : 'outline'}
          colorScheme={activeTab === 'records' ? 'blue' : 'gray'}
          onClick={() => setActiveTab('records')}
        >
          {t('debts.debtRecords' as TranslationKey)}
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'sale' ? 'solid' : 'outline'}
          colorScheme={activeTab === 'sale' ? 'blue' : 'gray'}
          onClick={() => setActiveTab('sale')}
        >
          {t('debts.saleDebts' as TranslationKey)}
        </Button>
      </HStack>
      {activeTab === 'records' ? debtRecordsContent : saleDebtsContent}
    </Box>
  );
}
