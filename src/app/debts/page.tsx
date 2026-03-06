export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { VStack } from '@chakra-ui/react';
import { getDebtors } from '@/actions/debts';
import SearchInput from '@/components/ui/SearchInput';
import TableSkeleton from '@/components/ui/TableSkeleton';
import DebtorList from '@/components/debts/DebtorList';
import PageHeader from '@/components/ui/PageHeader';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

async function DebtorListWrapper({ search }: { search?: string }) {
  const debtors = await getDebtors(search);
  return <DebtorList debtors={debtors} />;
}

export default async function DebtsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <VStack gap={6} align="stretch">
      <PageHeader titleKey="debts.title" />
      <SearchInput placeholderKey="debts.searchPlaceholder" />
      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <DebtorListWrapper search={params.q} />
      </Suspense>
    </VStack>
  );
}
