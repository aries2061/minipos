import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (!q.trim()) return NextResponse.json([]);

  const [items, debts] = await Promise.all([
    prisma.item.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      take: 5,
      select: { id: true, name: true },
    }),
    prisma.sale.findMany({
      where: { isDebt: true, debtorName: { contains: q, mode: 'insensitive' } },
      take: 5,
      select: { id: true, debtorName: true },
      distinct: ['debtorName'],
    }),
  ]);

  const results = [
    ...items.map((i) => ({ type: 'item', label: i.name, href: `/inventory?q=${i.name}` })),
    ...debts.map((d) => ({ type: 'debtor', label: d.debtorName!, href: `/debts?q=${d.debtorName}` })),
  ];

  return NextResponse.json(results);
}
