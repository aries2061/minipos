'use client';

import { HStack, Button, Input, Box, Text } from '@chakra-ui/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const presets = [
  { label: 'Today', value: 'today' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
];

export default function DateRangeFilter() {
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
            {p.label}
          </Button>
        ))}
        <HStack gap={2}>
          <Text fontSize="sm" color="gray.600">Custom:</Text>
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
          <Text fontSize="sm">to</Text>
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
