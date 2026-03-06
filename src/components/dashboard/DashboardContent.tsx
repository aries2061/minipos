'use client';

import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface DashboardContentProps {
  data: {
    itemCount: number;
    todaySalesCount: number;
    todayRevenue: number;
    todayProfit: number;
    lowStockItems: number;
    outstandingDebt: number;
  };
}

export default function DashboardContent({ data }: DashboardContentProps) {
  const { t } = useTranslation();

  const stats: { labelKey: TranslationKey; value: string }[] = [
    { labelKey: 'dashboard.totalItems', value: data.itemCount.toString() },
    { labelKey: 'dashboard.todaySales', value: data.todaySalesCount.toString() },
    { labelKey: 'dashboard.todayRevenue', value: formatCurrency(data.todayRevenue) },
    { labelKey: 'dashboard.todayProfit', value: formatCurrency(data.todayProfit) },
    { labelKey: 'dashboard.lowStockItems', value: data.lowStockItems.toString() },
    { labelKey: 'dashboard.outstandingDebt', value: formatCurrency(data.outstandingDebt) },
  ];

  return (
    <VStack gap={6} align="stretch">
      <Heading size="lg">{t('dashboard.title')}</Heading>
      <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
        {stats.map((stat) => (
          <Box
            key={stat.labelKey}
            bg="white"
            p={5}
            borderRadius="lg"
            shadow="sm"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" color="gray.600" mb={1}>
              {t(stat.labelKey)}
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {stat.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
