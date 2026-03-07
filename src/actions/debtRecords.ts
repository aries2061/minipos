'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createDebt(customerId: string, amount: number, note?: string) {
  if (amount <= 0) throw new Error('Amount must be positive');

  const debt = await prisma.debt.create({
    data: {
      customerId,
      amount,
      balance: amount,
      note: note || null,
    },
  });

  revalidatePath('/debts');
  return debt;
}

export async function getDebts(search?: string) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.customer = {
      name: { contains: search, mode: 'insensitive' },
    };
  }

  return prisma.debt.findMany({
    where,
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      payments: { orderBy: { createdAt: 'desc' } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDebtById(id: string) {
  return prisma.debt.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      payments: { orderBy: { createdAt: 'desc' } },
    },
  });
}

export async function recordPayment(debtId: string, amount: number, note?: string) {
  if (amount <= 0) throw new Error('Amount must be positive');

  const result = await prisma.$transaction(async (tx) => {
    const debt = await tx.debt.findUnique({ where: { id: debtId } });
    if (!debt) throw new Error('Debt not found');
    if (debt.status === 'settled') throw new Error('Debt is already settled');

    const payAmount = Math.min(amount, debt.balance);
    const newBalance = debt.balance - payAmount;

    await tx.debtPayment.create({
      data: {
        debtId,
        amount: payAmount,
        note: note || null,
      },
    });

    await tx.debt.update({
      where: { id: debtId },
      data: {
        balance: newBalance,
        status: newBalance <= 0 ? 'settled' : 'active',
      },
    });

    return { newBalance, settled: newBalance <= 0 };
  });

  revalidatePath('/debts');
  return result;
}

export async function deleteDebt(id: string) {
  await prisma.debt.delete({ where: { id } });
  revalidatePath('/debts');
}
