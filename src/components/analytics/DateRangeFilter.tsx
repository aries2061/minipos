'use client';

import { HStack, Button, Input, Box, Text } from '@chakra-ui/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

const presets = [
  { labelKey: 'analytics.today' as TranslationKey, value: 'today' },
  { labelKey: 'analytics.weekly' as TranslationKey, value: 'weekly' },
  { labelKey: 'analytics.monthly' as TranslationKey, value: 'monthly' },
  { labelKey: 'analytics.yearly' as TranslationKey, value: 'yearly' },
];

export default function DateRangeFilter() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPeriod = searchParams.get('period') || 'today';

  const setPeriod = (period: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', period);
    params.delete('from');
    params.delete('to');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setCustomRange = (from: string, to: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', 'custom');
    params.set('from', from);
    params.set('to', to);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Box>
      <HStack gap={2} flexWrap="wrap">
        {presets.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={currentPeriod === p.value ? 'solid' : 'outline'}
            colorScheme={currentPeriod === p.value ? 'blue' : 'gray'}
            onClick={() => setPeriod(p.value)}
          >
            {t(p.labelKey)}
          </Button>
        ))}
        <HStack gap={2}>
          <Text fontSize="sm" color="gray.600">{t('analytics.custom')}</Text>
          <Input
            type="date"
            size="sm"
            w="150px"
            defaultValue={searchParams.get('from') || ''}
            onChange={(e) => {
              const to = searchParams.get('to') || new Date().toISOString().split('T')[0];
              if (e.target.value) setCustomRange(e.target.value, to);
            }}
          />
          <Text fontSize="sm">{t('analytics.to')}</Text>
          <Input
            type="date"
            size="sm"
            w="150px"
            defaultValue={searchParams.get('to') || ''}
            onChange={(e) => {
              const from = searchParams.get('from') || new Date().toISOString().split('T')[0];
              if (e.target.value) setCustomRange(from, e.target.value);
            }}
          />
        </HStack>
      </HStack>
    </Box>
  );
}
