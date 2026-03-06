export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { VStack, Heading, HStack } from '@chakra-ui/react';
import { getItems } from '@/actions/inventory';
import SearchInput from '@/components/ui/SearchInput';
import TableSkeleton from '@/components/ui/TableSkeleton';
import ItemList from '@/components/inventory/ItemList';

interface Props {
  searchParams: Promise<{ q?: string; lowStock?: string }>;
}

async function ItemListWrapper({ search, lowStock }: { search?: string; lowStock?: boolean }) {
  const items = await getItems(search, lowStock);
  return <ItemList items={items} />;
}

export default async function InventoryPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q;
  const lowStock = params.lowStock === 'true';

  return (
    <VStack gap={6} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Inventory</Heading>
      </HStack>
      <SearchInput placeholder="Search items by name, category, or SKU..." />
      <Suspense fallback={<TableSkeleton rows={8} columns={7} />}>
        <ItemListWrapper search={search} lowStock={lowStock} />
      </Suspense>
    </VStack>
  );
}
