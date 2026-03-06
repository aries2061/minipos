import { VStack, Heading, Skeleton, SimpleGrid } from '@chakra-ui/react';

export default function Loading() {
  return (
    <VStack gap={6} align="stretch">
      <Heading size="lg">Analytics</Heading>
      <Skeleton height="36px" maxW="600px" />
      <SimpleGrid columns={{ base: 2, md: 5 }} gap={4}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} height="80px" borderRadius="md" />
        ))}
      </SimpleGrid>
      <Skeleton height="300px" borderRadius="md" />
    </VStack>
  );
}
