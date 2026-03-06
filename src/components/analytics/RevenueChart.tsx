'use client';

import { Box, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  grossRevenue: number;
  netProfit: number;
  totalSales: number;
  costTotal: number;
}

export default function RevenueChart({ grossRevenue, netProfit, totalSales, costTotal }: RevenueChartProps) {
  const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  const stats = [
    { label: 'Gross Revenue', value: formatCurrency(grossRevenue), color: 'blue.600' },
    { label: 'Total Cost', value: formatCurrency(costTotal), color: 'orange.600' },
    { label: 'Net Profit', value: formatCurrency(netProfit), color: 'green.600' },
    { label: 'Total Sales', value: totalSales.toString(), color: 'purple.600' },
    { label: 'Profit Margin', value: `${profitMargin}%`, color: 'teal.600' },
  ];

  return (
    <SimpleGrid columns={{ base: 2, md: 5 }} gap={4}>
      {stats.map((stat) => (
        <Box key={stat.label} bg="white" p={4} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
          <VStack gap={1} align="start">
            <Text fontSize="xs" color="gray.500">{stat.label}</Text>
            <Text fontSize="xl" fontWeight="bold" color={stat.color}>{stat.value}</Text>
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
