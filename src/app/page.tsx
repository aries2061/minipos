export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay } from 'date-fns';
import DashboardContent from '@/components/dashboard/DashboardContent';

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
  return <DashboardContent data={data} />;
}
