import { VStack, Heading, Skeleton, HStack } from '@chakra-ui/react';
import TableSkeleton from '@/components/ui/TableSkeleton';

export default function Loading() {
  return (
    <VStack gap={8} align="stretch">
      <Heading size="lg">Point of Sale</Heading>
      <HStack gap={6}>
        <Skeleton height="400px" flex={1} borderRadius="md" />
        <Skeleton height="400px" w="380px" borderRadius="md" />
      </HStack>
      <TableSkeleton rows={5} columns={6} />
    </VStack>
  );
}
