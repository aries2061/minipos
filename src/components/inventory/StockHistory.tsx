'use client';

import { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Badge, Button, Input, Flex } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useTranslation } from '@/lib/i18n';
import { getStockLogs, restockItem } from '@/actions/stockLogs';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface StockLog {
  id: string;
  type: string;
  quantity: number;
  note: string | null;
  createdAt: Date;
}

interface StockHistoryProps {
  itemId: string;
  itemName: string;
}

const typeConfig: Record<string, { colorScheme: string; labelKey: TranslationKey }> = {
  INITIAL: { colorScheme: 'blue', labelKey: 'inventory.initialStock' },
  RESTOCK: { colorScheme: 'green', labelKey: 'inventory.restockLabel' },
  SALE: { colorScheme: 'orange', labelKey: 'inventory.saleDeduction' },
};

export default function StockHistory({ itemId, itemName }: StockHistoryProps) {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [restockQty, setRestockQty] = useState('');
  const [restockNote, setRestockNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getStockLogs(itemId);
      setLogs(data);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [itemId]);

  const handleRestock = async () => {
    const qty = parseInt(restockQty);
    if (!qty || qty <= 0) return;

    setSubmitting(true);
    setError('');
    try {
      await restockItem(itemId, qty, restockNote || undefined);
      setRestockQty('');
      setRestockNote('');
      await fetchLogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restock');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VStack align="stretch" gap={3}>
      {/* Restock Form */}
      <Box bg="blue.50" p={3} borderRadius="md">
        <Text fontSize="sm" fontWeight="medium" mb={2}>{t('inventory.restock' as TranslationKey)} — {itemName}</Text>
        <HStack gap={2}>
          <Input
            type="number"
            size="sm"
            placeholder={t('inventory.restockQuantity' as TranslationKey)}
            value={restockQty}
            onChange={(e) => setRestockQty(e.target.value)}
            w="100px"
            min={1}
          />
          <Input
            size="sm"
            placeholder={t('inventory.restockNote' as TranslationKey)}
            value={restockNote}
            onChange={(e) => setRestockNote(e.target.value)}
            flex={1}
          />
          <Button
            size="sm"
            colorScheme="green"
            onClick={handleRestock}
            loading={submitting}
            disabled={!restockQty || parseInt(restockQty) <= 0}
          >
            {t('inventory.restock' as TranslationKey)}
          </Button>
        </HStack>
        {error && <Text color="red.500" fontSize="xs" mt={1}>{error}</Text>}
      </Box>

      {/* Log Timeline */}
      <Text fontSize="sm" fontWeight="medium">{t('inventory.stockHistory' as TranslationKey)}</Text>
      {loading ? (
        <Text fontSize="sm" color="gray.500">Loading...</Text>
      ) : logs.length === 0 ? (
        <Text fontSize="sm" color="gray.500">{t('inventory.noLogs' as TranslationKey)}</Text>
      ) : (
        <VStack align="stretch" gap={1} maxH="250px" overflowY="auto">
          {logs.map((log) => {
            const config = typeConfig[log.type] || typeConfig.INITIAL;
            return (
              <Flex key={log.id} justify="space-between" align="center" py={1.5} px={2} bg="gray.50" borderRadius="sm">
                <HStack gap={2}>
                  <Badge colorScheme={config.colorScheme} fontSize="xs" w="70px" textAlign="center">
                    {t(config.labelKey)}
                  </Badge>
                  <Text fontSize="sm" fontWeight="medium" color={log.quantity > 0 ? 'green.600' : 'red.600'}>
                    {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                  </Text>
                  {log.note && (
                    <Text fontSize="xs" color="gray.500">{log.note}</Text>
                  )}
                </HStack>
                <Text fontSize="xs" color="gray.500">
                  {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm')}
                </Text>
              </Flex>
            );
          })}
        </VStack>
      )}
    </VStack>
  );
}
