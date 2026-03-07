'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function settleDebt(saleId: string) {
  const sale = await prisma.sale.findUnique({ where: { id: saleId } });
  if (!sale) throw new Error('Sale not found');

  await prisma.sale.update({
    where: { id: saleId },
    data: { isPaid: true, paidAmount: sale.totalAmount, paidAt: new Date() },
  });
  revalidatePath('/debts');
  revalidatePath('/analytics');
}

export async function recordSalePayment(saleId: string, amount: number) {
  if (amount <= 0) throw new Error('Amount must be positive');

  const sale = await prisma.sale.findUnique({ where: { id: saleId } });
  if (!sale) throw new Error('Sale not found');
  if (sale.isPaid) throw new Error('Sale debt is already settled');

  const remaining = sale.totalAmount - sale.paidAmount;
  const payAmount = Math.min(amount, remaining);
  const newPaidAmount = sale.paidAmount + payAmount;
  const fullyPaid = newPaidAmount >= sale.totalAmount;

  await prisma.sale.update({
    where: { id: saleId },
    data: {
      paidAmount: newPaidAmount,
      isPaid: fullyPaid,
      paidAt: fullyPaid ? new Date() : null,
    },
  });

  revalidatePath('/debts');
  revalidatePath('/analytics');
  return { newPaidAmount, remaining: sale.totalAmount - newPaidAmount, settled: fullyPaid };
}

export async function getDebtors(search?: string) {
  const where: Record<string, unknown> = {
    isDebt: true,
  };

  if (search) {
    where.debtorName = { contains: search, mode: 'insensitive' };
  }

  const debts = await prisma.sale.findMany({
    where,
    include: { items: { include: { item: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Group by debtor
  const debtorMap = new Map<string, {
    debtorName: string;
    totalDebt: number;
    totalPaid: number;
    outstandingBalance: number;
    saleCount: number;
    sales: typeof debts;
  }>();

  for (const sale of debts) {
    const name = sale.debtorName || 'Unknown';
    const existing = debtorMap.get(name) || {
      debtorName: name,
      totalDebt: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      saleCount: 0,
      sales: [] as typeof debts,
    };

    existing.totalDebt += sale.totalAmount;
    existing.totalPaid += sale.paidAmount;
    existing.outstandingBalance += (sale.totalAmount - sale.paidAmount);
    existing.saleCount += 1;
    existing.sales.push(sale);
    debtorMap.set(name, existing);
  }

  return Array.from(debtorMap.values());
}

export async function getDebtsByDateRange(from: Date, to: Date) {
  return prisma.sale.findMany({
    where: {
      isDebt: true,
      createdAt: { gte: from, lte: to },
    },
    include: { items: { include: { item: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
