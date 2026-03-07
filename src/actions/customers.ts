'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface CustomerInput {
  name: string;
  phone?: string;
}

export async function createCustomer(data: CustomerInput) {
  const customer = await prisma.customer.create({ data });
  revalidatePath('/customers');
  return customer;
}

export async function updateCustomer(id: string, data: Partial<CustomerInput>) {
  const customer = await prisma.customer.update({ where: { id }, data });
  revalidatePath('/customers');
  return customer;
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } });
  revalidatePath('/customers');
}

export async function getCustomers(search?: string) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.customer.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCustomersList() {
  return prisma.customer.findMany({
    select: { id: true, name: true, phone: true },
    orderBy: { name: 'asc' },
  });
}
