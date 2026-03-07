'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getStockLogs(itemId: string) {
  return prisma.stockLog.findMany({
    where: { itemId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function restockItem(itemId: string, quantity: number, note?: string) {
  if (quantity <= 0) throw new Error('Quantity must be positive');

  await prisma.$transaction(async (tx) => {
    await tx.item.update({
      where: { id: itemId },
      data: { stock: { increment: quantity } },
    });

    await tx.stockLog.create({
      data: {
        itemId,
        type: 'RESTOCK',
        quantity,
        note: note || null,
      },
    });
  });

  revalidatePath('/inventory');
  revalidatePath('/analytics');
  revalidatePath('/');
}

export async function getStockActivity(from: Date, to: Date) {
  return prisma.stockLog.findMany({
    where: {
      createdAt: { gte: from, lte: to },
    },
    include: { item: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
