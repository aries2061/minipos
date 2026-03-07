'use client';

import { Box, Text, Flex, Badge, VStack } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface StockLogWithItem {
  id: string;
  type: string;
  quantity: number;
  note: string | null;
  createdAt: Date;
  item: { name: string };
}

interface StockActivityProps {
  logs: StockLogWithItem[];
}

const typeConfig: Record<string, { colorScheme: string; labelKey: TranslationKey }> = {
  INITIAL: { colorScheme: 'blue', labelKey: 'inventory.initialStock' },
  RESTOCK: { colorScheme: 'green', labelKey: 'inventory.restockLabel' },
  SALE: { colorScheme: 'orange', labelKey: 'inventory.saleDeduction' },
};

export default function StockActivity({ logs }: StockActivityProps) {
  const { t } = useTranslation();

  if (logs.length === 0) {
    return (
      <Box bg="white" p={6} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Text color="gray.500" textAlign="center">{t('analytics.noStockActivity' as TranslationKey)}</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200" overflow="hidden">
      <Box px={4} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
        <Text fontWeight="semibold" fontSize="sm">{t('analytics.stockActivity' as TranslationKey)}</Text>
      </Box>
      <VStack align="stretch" gap={0} maxH="400px" overflowY="auto">
        {logs.map((log, i) => {
          const config = typeConfig[log.type] || typeConfig.INITIAL;
          return (
            <Flex
              key={log.id}
              px={4}
              py={3}
              justify="space-between"
              align="center"
              borderBottom={i < logs.length - 1 ? '1px solid' : 'none'}
              borderColor="gray.100"
            >
              <Flex align="center" gap={3}>
                <Badge colorScheme={config.colorScheme} fontSize="xs" w="70px" textAlign="center">
                  {t(config.labelKey)}
                </Badge>
                <Text fontSize="sm">{log.item.name}</Text>
              </Flex>
              <Flex gap={4} align="center">
                <Text fontSize="sm" fontWeight="medium" color={log.quantity > 0 ? 'green.600' : 'red.600'}>
                  {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {format(new Date(log.createdAt), 'MMM dd, HH:mm')}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
}
