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

async function ensureCategoryLink(categoryName: string): Promise<string | null> {
  if (!categoryName) return null;
  const existing = await prisma.category.findUnique({ where: { name: categoryName } });
  if (existing) return existing.id;

  const created = await prisma.category.create({ data: { name: categoryName } });
  return created.id;
}

export async function createItem(data: ItemInput) {
  const categoryId = await ensureCategoryLink(data.category);

  const item = await prisma.$transaction(async (tx) => {
    const created = await tx.item.create({
      data: {
        ...data,
        categoryId,
      },
    });
    await tx.stockLog.create({
      data: {
        itemId: created.id,
        type: 'INITIAL',
        quantity: data.stock,
      },
    });
    return created;
  });
  revalidatePath('/inventory');
  revalidatePath('/sales');
  return item;
}

export async function updateItem(id: string, data: Partial<ItemInput>) {
  let categoryId: string | null | undefined;
  if (data.category) {
    categoryId = await ensureCategoryLink(data.category);
  }

  const item = await prisma.item.update({
    where: { id },
    data: {
      ...data,
      ...(categoryId !== undefined ? { categoryId } : {}),
    },
  });
  revalidatePath('/inventory');
  revalidatePath('/sales');
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
