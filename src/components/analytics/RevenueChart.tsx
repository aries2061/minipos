'use client';

import { Box, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface RevenueChartProps {
  grossRevenue: number;
  netProfit: number;
  totalSales: number;
  costTotal: number;
}

export default function RevenueChart({ grossRevenue, netProfit, totalSales, costTotal }: RevenueChartProps) {
  const { t } = useTranslation();
  const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  const stats: { labelKey: TranslationKey; value: string; color: string }[] = [
    { labelKey: 'analytics.grossRevenue', value: formatCurrency(grossRevenue), color: 'blue.600' },
    { labelKey: 'analytics.totalCost', value: formatCurrency(costTotal), color: 'orange.600' },
    { labelKey: 'analytics.netProfit', value: formatCurrency(netProfit), color: 'green.600' },
    { labelKey: 'analytics.totalSales', value: totalSales.toString(), color: 'purple.600' },
    { labelKey: 'analytics.profitMargin', value: `${profitMargin}%`, color: 'teal.600' },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 5 }} gap={4}>
      {stats.map((stat) => (
        <Box key={stat.labelKey} bg="white" p={4} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
          <VStack gap={1} align="start">
            <Text fontSize="xs" color="gray.500">{t(stat.labelKey)}</Text>
            <Text fontSize="xl" fontWeight="bold" color={stat.color}>{stat.value}</Text>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
