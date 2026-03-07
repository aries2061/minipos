'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { items: true } } },
  });
}

export async function getCategoryList() {
  return prisma.category.findMany({
    select: { id: true, name: true, icon: true },
    orderBy: { name: 'asc' },
  });
}

export async function createCategory(name: string, icon: string = 'FiFolder') {
  const category = await prisma.category.create({
    data: { name, icon },
  });
  revalidatePath('/inventory');
  return category;
}

export async function updateCategory(id: string, data: { name?: string; icon?: string }) {
  const category = await prisma.category.update({
    where: { id },
    data,
  });
  revalidatePath('/inventory');
  return category;
}

export async function deleteCategory(id: string) {
  const itemCount = await prisma.item.count({ where: { categoryId: id } });
  if (itemCount > 0) {
    throw new Error('Cannot delete category with linked items');
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath('/inventory');
}

export async function ensureCategory(name: string): Promise<string> {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) return existing.id;

  const created = await prisma.category.create({
    data: { name },
  });
  return created.id;
}
