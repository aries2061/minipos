'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface ItemInput {
  name: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  sku?: string;
}

export async function createItem(data: ItemInput) {
  const item = await prisma.item.create({ data });
  revalidatePath('/inventory');
  return item;
}

export async function updateItem(id: string, data: Partial<ItemInput>) {
  const item = await prisma.item.update({ where: { id }, data });
  revalidatePath('/inventory');
  return item;
}

export async function deleteItem(id: string) {
  await prisma.item.delete({ where: { id } });
  revalidatePath('/inventory');
}

export async function getItems(search?: string, lowStock?: boolean) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { sku: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (lowStock) {
    where.stock = { lte: 5 };
  }

  return prisma.item.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}
