import { Box, Skeleton, VStack, HStack } from '@chakra-ui/react';

export default function Loading() {
  return (
    <VStack gap={6} align="stretch">
      <HStack gap={4}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} height="100px" flex={1} borderRadius="md" />
        ))}
      </HStack>
      <Skeleton height="300px" borderRadius="md" />
    </VStack>
  );
}
