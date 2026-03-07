export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { VStack } from '@chakra-ui/react';
import { getDebtors } from '@/actions/debts';
import { getDebts } from '@/actions/debtRecords';
import SearchInput from '@/components/ui/SearchInput';
import TableSkeleton from '@/components/ui/TableSkeleton';
import DebtorList from '@/components/debts/DebtorList';
import DebtRecordList from '@/components/debts/DebtRecordList';
import DebtTabs from '@/components/debts/DebtTabs';
import PageHeader from '@/components/ui/PageHeader';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

async function DebtContent({ search }: { search?: string }) {
  const [debtors, debtRecords] = await Promise.all([
    getDebtors(search),
    getDebts(search),
  ]);

  return (
    <DebtTabs
      saleDebtsContent={<DebtorList debtors={debtors} />}
      debtRecordsContent={<DebtRecordList initialDebts={debtRecords} search={search} />}
    />
  );
}

export default async function DebtsPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <VStack gap={6} align="stretch">
      <PageHeader titleKey="debts.title" />
      <SearchInput placeholderKey="debts.searchPlaceholder" />
      <Suspense fallback={<TableSkeleton rows={6} columns={5} />}>
        <DebtContent search={params.q} />
      </Suspense>
    </VStack>
  );
}
