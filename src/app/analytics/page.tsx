export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { VStack, Skeleton } from '@chakra-ui/react';
import PageHeader from '@/components/ui/PageHeader';
import { prisma } from '@/lib/prisma';
import { getDateRange } from '@/lib/utils';
import { endOfDay, startOfDay } from 'date-fns';
import DateRangeFilter from '@/components/analytics/DateRangeFilter';
import RevenueChart from '@/components/analytics/RevenueChart';
import PopularItems from '@/components/analytics/PopularItems';
import type { PopularItem } from '@/types';

interface Props {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}

async function AnalyticsData({ from, to }: { from: Date; to: Date }) {
  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: from, lte: to } },
    include: { items: { include: { item: true } } },
  });

  const grossRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const costTotal = sales.reduce((sum, s) => sum + s.costTotal, 0);
  const netProfit = grossRevenue - costTotal;

  // Popular items
  const itemMap = new Map<string, PopularItem>();
  for (const sale of sales) {
    for (const si of sale.items) {
      const existing = itemMap.get(si.itemId) || {
        itemId: si.itemId,
        itemName: si.item.name,
        totalQuantity: 0,
        totalRevenue: 0,
      };
      existing.totalQuantity += si.quantity;
      existing.totalRevenue += si.price * si.quantity;
      itemMap.set(si.itemId, existing);
    }
  }

  const popularItems = Array.from(itemMap.values())
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 10);

  return (
    <VStack gap={6} align="stretch">
      <RevenueChart
        grossRevenue={grossRevenue}
        netProfit={netProfit}
        totalSales={sales.length}
        costTotal={costTotal}
      />
      <PopularItems items={popularItems} />
    </VStack>
  );
}

export default async function AnalyticsPage({ searchParams }: Props) {
  const params = await searchParams;
  const period = params.period || 'today';

  let from: Date;
  let to: Date;

  if (period === 'custom' && params.from && params.to) {
    from = startOfDay(new Date(params.from));
    to = endOfDay(new Date(params.to));
  } else {
    const range = getDateRange(period);
    from = range.from;
    to = range.to;
  }

  return (
    <VStack gap={6} align="stretch">
      <PageHeader titleKey="analytics.title" />
      <DateRangeFilter />
      <Suspense fallback={<Skeleton height="300px" borderRadius="md" />}>
        <AnalyticsData from={from} to={to} />
      </Suspense>
    </VStack>
  );
}
