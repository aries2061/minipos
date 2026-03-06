export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { VStack, Heading, Box, Text } from '@chakra-ui/react';
import { prisma } from '@/lib/prisma';
import TableSkeleton from '@/components/ui/TableSkeleton';
import Cart from '@/components/sales/Cart';
import SalesList from '@/components/sales/SalesList';

async function POSSection() {
  const items = await prisma.item.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { name: 'asc' },
  });
  return <Cart items={items} />;
}

async function RecentSalesSection() {
  const sales = await prisma.sale.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { item: true } } },
  });
  return (
    <Box>
      <Text fontSize="md" fontWeight="semibold" mb={3}>Recent Sales</Text>
      <SalesList sales={sales} />
    </Box>
  );
}

export default function SalesPage() {
  return (
    <VStack gap={8} align="stretch">
      <Heading size="lg">Point of Sale</Heading>
      <Suspense fallback={<TableSkeleton rows={6} columns={4} />}>
        <POSSection />
      </Suspense>
      <Suspense fallback={<TableSkeleton rows={5} columns={6} />}>
        <RecentSalesSection />
      </Suspense>
    </VStack>
  );
}
