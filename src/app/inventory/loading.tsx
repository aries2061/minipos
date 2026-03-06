import { VStack, Heading, Skeleton } from '@chakra-ui/react';
import TableSkeleton from '@/components/ui/TableSkeleton';

export default function Loading() {
  return (
    <VStack gap={6} align="stretch">
      <Heading size="lg">Inventory</Heading>
      <Skeleton height="32px" maxW="400px" />
      <TableSkeleton rows={8} columns={7} />
    </VStack>
  );
}
