import { VStack, Heading, Skeleton } from '@chakra-ui/react';
import TableSkeleton from '@/components/ui/TableSkeleton';

export default function Loading() {
  return (
    <VStack gap={6} align="stretch">
      <Heading size="lg">Debt Management</Heading>
      <Skeleton height="32px" maxW="400px" />
      <TableSkeleton rows={6} columns={5} />
    </VStack>
  );
}
