'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { SalePayload } from '@/types';

export async function createSale(payload: SalePayload) {
  const sale = await prisma.$transaction(async (tx) => {
    // Validate stock availability
    for (const item of payload.items) {
      const dbItem = await tx.item.findUnique({ where: { id: item.itemId } });
      if (!dbItem) throw new Error(`Item ${item.itemId} not found`);
      if (dbItem.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${dbItem.name}. Available: ${dbItem.stock}`);
      }
    }

    // Auto-create customer if debt mode and name doesn't match existing
    if (payload.paymentMode === 'debt' && payload.debtorName) {
      const existingCustomer = await tx.customer.findFirst({
        where: { name: { equals: payload.debtorName, mode: 'insensitive' } },
      });
      if (!existingCustomer) {
        await tx.customer.create({
          data: { name: payload.debtorName },
        });
      }
    }

    // Create sale record
    const sale = await tx.sale.create({
      data: {
        totalAmount: payload.totalAmount,
        costTotal: payload.costTotal,
        paymentMode: payload.paymentMode,
        isDebt: payload.paymentMode === 'debt',
        debtorName: payload.paymentMode === 'debt' ? payload.debtorName : null,
        isPaid: payload.paymentMode !== 'debt',
        items: {
          create: payload.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            price: item.price,
            costPrice: item.costPrice,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock and log
    for (const item of payload.items) {
      await tx.item.update({
        where: { id: item.itemId },
        data: { stock: { decrement: item.quantity } },
      });
      await tx.stockLog.create({
        data: {
          itemId: item.itemId,
          type: 'SALE',
          quantity: -item.quantity,
          note: `Sale #${sale.id}`,
        },
      });
    }

    return sale;
  });

  revalidatePath('/');
  revalidatePath('/inventory');
  revalidatePath('/sales');
  revalidatePath('/analytics');
  revalidatePath('/debts');

  return sale;
}

export async function getSales(from?: Date, to?: Date) {
  const where: Record<string, unknown> = {};
  if (from && to) {
    where.createdAt = { gte: from, lte: to };
  }

  return prisma.sale.findMany({
    where,
    include: { items: { include: { item: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
