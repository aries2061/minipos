import { Box, Skeleton, VStack, HStack } from '@chakra-ui/react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <Box borderRadius="md" border="1px solid" borderColor="gray.200" p={4}>
      <HStack gap={4} mb={4}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="20px" flex={1} />
        ))}
      </HStack>
      <VStack gap={3} align="stretch">
        {Array.from({ length: rows }).map((_, i) => (
          <HStack key={i} gap={4}>
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} height="16px" flex={1} />
            ))}
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}
