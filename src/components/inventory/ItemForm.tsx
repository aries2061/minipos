'use client';

import { Box, Button, Input, VStack, HStack, Text } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { createItem, updateItem } from '@/actions/inventory';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface CategoryOption {
  id: string;
  name: string;
  icon: string;
}

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
  categories: CategoryOption[];
  onClose: () => void;
}

export default function ItemForm({ item, categories, onClose }: ItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryInput, setCategoryInput] = useState(item?.category || 'General');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const filteredCategories = categoryInput.trim()
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(categoryInput.toLowerCase())
      )
    : categories;

  const isNewCategory = categoryInput.trim() &&
    !categories.some((c) => c.name.toLowerCase() === categoryInput.trim().toLowerCase());

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      category: categoryInput.trim() || 'General',
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
            <Box flex={1} ref={suggestionsRef} position="relative">
              <Text fontSize="sm" mb={1}>{t('inventory.category')}</Text>
              <Input
                size="sm"
                value={categoryInput}
                onChange={(e) => {
                  setCategoryInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  boxShadow="md"
                  zIndex={10}
                  maxH="180px"
                  overflowY="auto"
                  mt={1}
                >
                  {filteredCategories.map((c) => (
                    <Box
                      key={c.id}
                      px={3}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: 'blue.50' }}
                      onClick={() => {
                        setCategoryInput(c.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <Text fontSize="sm">{c.name}</Text>
                    </Box>
                  ))}
                  {isNewCategory && (
                    <Box
                      px={3}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: 'green.50' }}
                      borderTop={filteredCategories.length > 0 ? '1px solid' : 'none'}
                      borderColor="gray.100"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <Text fontSize="sm" color="green.600" fontWeight="medium">
                        + {t('inventory.addNewCategory' as TranslationKey)} &quot;{categoryInput.trim()}&quot;
                      </Text>
                    </Box>
                  )}
                </Box>
              )}
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
