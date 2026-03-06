'use client';

import { Box, Button, Input, VStack, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { createItem, updateItem } from '@/actions/inventory';
import { useTranslation } from '@/lib/i18n';

interface ItemFormProps {
  item?: {
    id: string;
    name: string;
    category: string;
    costPrice: number;
    salePrice: number;
    stock: number;
    sku: string | null;
  };
  onClose: () => void;
}

export default function ItemForm({ item, onClose }: ItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      costPrice: parseFloat(formData.get('costPrice') as string),
      salePrice: parseFloat(formData.get('salePrice') as string),
      stock: parseInt(formData.get('stock') as string),
      sku: (formData.get('sku') as string) || undefined,
    };

    try {
      if (item) {
        await updateItem(item.id, data);
      } else {
        await createItem(data);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px solid" borderColor="gray.200">
      <Text fontSize="lg" fontWeight="semibold" mb={4}>
        {item ? t('inventory.editItem') : t('inventory.addNewItem')}
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <HStack gap={4}>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>{t('inventory.itemName')}</Text>
              <Input name="name" defaultValue={item?.name} required size="sm" />
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>{t('inventory.category')}</Text>
              <Input name="category" defaultValue={item?.category || 'General'} size="sm" />
            </Box>
          </HStack>
          <HStack gap={4}>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>{t('inventory.costPrice')}</Text>
              <Input name="costPrice" type="number" step="0.01" defaultValue={item?.costPrice} required size="sm" />
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>{t('inventory.salePrice')}</Text>
              <Input name="salePrice" type="number" step="0.01" defaultValue={item?.salePrice} required size="sm" />
            </Box>
          </HStack>
          <HStack gap={4}>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>{t('inventory.stockQuantity')}</Text>
              <Input name="stock" type="number" defaultValue={item?.stock ?? 0} required size="sm" />
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>{t('inventory.skuBarcode')}</Text>
              <Input name="sku" defaultValue={item?.sku || ''} size="sm" />
            </Box>
          </HStack>
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          <HStack gap={2} justify="flex-end">
            <Button size="sm" variant="outline" onClick={onClose}>{t('action.cancel')}</Button>
            <Button size="sm" colorScheme="blue" type="submit" loading={loading}>
              {item ? t('action.update') : t('action.create')}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}
