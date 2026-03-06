export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { Box, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { formatCurrency } from '@/lib/utils';
import { startOfDay, endOfDay } from 'date-fns';

async function getDashboardData() {
  const today = new Date();
  const from = startOfDay(today);
  const to = endOfDay(today);

  const [itemCount, todaySales, lowStockItems, totalDebts] = await Promise.all([
    prisma.item.count(),
    prisma.sale.findMany({
      where: { createdAt: { gte: from, lte: to } },
      include: { items: true },
    }),
    prisma.item.count({ where: { stock: { lte: 5 } } }),
    prisma.sale.aggregate({
      where: { isDebt: true, isPaid: false },
      _sum: { totalAmount: true },
    }),
  ]);

  const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayProfit = todaySales.reduce(
    (sum, s) => sum + (s.totalAmount - s.costTotal),
    0
  );

  return {
    itemCount,
    todayRevenue,
    todayProfit,
    todaySalesCount: todaySales.length,
    lowStockItems,
    outstandingDebt: totalDebts._sum.totalAmount || 0,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const stats = [
    { label: 'Total Items', value: data.itemCount.toString() },
    { label: "Today's Sales", value: data.todaySalesCount.toString() },
    { label: "Today's Revenue", value: formatCurrency(data.todayRevenue) },
    { label: "Today's Profit", value: formatCurrency(data.todayProfit) },
    { label: 'Low Stock Items', value: data.lowStockItems.toString() },
    { label: 'Outstanding Debt', value: formatCurrency(data.outstandingDebt) },
  ];

  return (
    <VStack gap={6} align="stretch">
      <Heading size="lg">Dashboard</Heading>
      <SimpleGrid columns={{ base: 2, md: 3 }} gap={4}>
        {stats.map((stat) => (
          <Box
            key={stat.label}
            bg="white"
            p={5}
            borderRadius="lg"
            shadow="sm"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" color="gray.600" mb={1}>
              {stat.label}
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
