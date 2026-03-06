'use client';

import { Box, Text, Flex, Badge } from '@chakra-ui/react';
import { formatCurrency } from '@/lib/utils';
import type { PopularItem } from '@/types';

interface PopularItemsProps {
  items: PopularItem[];
}

export default function PopularItems({ items }: PopularItemsProps) {
  if (items.length === 0) {
    return (
      <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Text color="gray.500" textAlign="center">No sales data for this period</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" overflow="hidden">
      <Box px={4} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
        <Text fontWeight="semibold" fontSize="sm">Most Sold Items</Text>
      </Box>
      {items.map((item, i) => (
        <Flex
          key={item.itemId}
          px={4}
          py={3}
          justify="space-between"
          align="center"
          borderBottom={i < items.length - 1 ? '1px solid' : 'none'}
          borderColor="gray.100"
        >
          <Flex align="center" gap={3}>
            <Badge colorScheme="blue" borderRadius="full" w="24px" h="24px" display="flex" alignItems="center" justifyContent="center">
              {i + 1}
            </Badge>
            <Text fontSize="sm">{item.itemName}</Text>
          </Flex>
          <Flex gap={4} align="center">
            <Text fontSize="xs" color="gray.500">{item.totalQuantity} sold</Text>
            <Text fontSize="sm" fontWeight="medium">{formatCurrency(item.totalRevenue)}</Text>
          </Flex>
        </Flex>
      ))}
    </Box>
  );
}
