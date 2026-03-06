export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { VStack, HStack } from '@chakra-ui/react';
import { getCustomers } from '@/actions/customers';
import SearchInput from '@/components/ui/SearchInput';
import TableSkeleton from '@/components/ui/TableSkeleton';
import CustomerList from '@/components/customers/CustomerList';
import PageHeader from '@/components/ui/PageHeader';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

async function CustomerListWrapper({ search }: { search?: string }) {
  const customers = await getCustomers(search);
  return <CustomerList customers={customers} />;
}

export default async function CustomersPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q;

  return (
    <VStack gap={6} align="stretch">
      <HStack justify="space-between">
        <PageHeader titleKey="customers.title" />
      </HStack>
      <SearchInput placeholderKey="customers.searchPlaceholder" />
      <Suspense fallback={<TableSkeleton rows={8} columns={3} />}>
        <CustomerListWrapper search={search} />
      </Suspense>
    </VStack>
  );
}
