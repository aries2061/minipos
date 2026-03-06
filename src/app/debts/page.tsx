export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { VStack, Heading, HStack, Text } from '@chakra-ui/react';
import { getDebtors } from '@/actions/debts';
import SearchInput from '@/components/ui/SearchInput';
import TableSkeleton from '@/components/ui/TableSkeleton';
import DebtorList from '@/components/debts/DebtorList';
import { formatCurrency } from '@/lib/utils';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

async function DebtorListWrapper({ search }: { search?: string }) {
  const debtors = await getDebtors(search);

  const totalOutstanding = debtors.reduce((sum, d) => sum + d.outstandingBalance, 0);
  const totalDebtors = debtors.filter((d) => d.outstandingBalance > 0).length;

  return (
    <VStack gap={4} align="stretch">
      <HStack gap={6}>
        <Text fontSize="sm" color="gray.600">
          Active Debtors: <Text as="span" fontWeight="bold">{totalDebtors}</Text>
        </Text>
        <Text fontSize="sm" color="gray.600">
          Total Outstanding: <Text as="span" fontWeight="bold" color="red.600">{formatCurrency(totalOutstanding)}</Text>
        </Text>
      </HStack>
      <DebtorList debtors={debtors} />
    </VStack>
  );
}

export default async function DebtsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <VStack gap={6} align="stretch">
      <Heading size="lg">Debt Management</Heading>
      <SearchInput placeholder="Search debtors by name..." />
      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <DebtorListWrapper search={params.q} />
      </Suspense>
    </VStack>
  );
}
