'use client';

import { useState } from 'react';
import { Box, Button, Input, Text, VStack, HStack } from '@chakra-ui/react';
import { createCategory, updateCategory } from '@/actions/categories';
import { useTranslation } from '@/lib/i18n';
import IconPicker from './IconPicker';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface CategoryFormProps {
  category?: { id: string; name: string; icon: string };
  onClose: () => void;
}

export default function CategoryForm({ category, onClose }: CategoryFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || 'FiFolder');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');
    try {
      if (category) {
        await updateCategory(category.id, { name: name.trim(), icon });
      } else {
        await createCategory(name.trim(), icon);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200" mb={4}>
      <Text fontWeight="semibold" mb={3}>
        {category ? t('inventory.editCategory' as TranslationKey) : t('inventory.addCategory' as TranslationKey)}
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack gap={3} align="stretch">
          <Box>
            <Text fontSize="sm" mb={1}>{t('inventory.categoryName' as TranslationKey)} *</Text>
            <Input
              size="sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Box>
          <IconPicker value={icon} onChange={setIcon} />
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          <HStack gap={2}>
            <Button type="submit" size="sm" colorScheme="blue" loading={loading} disabled={!name.trim()}>
              {category ? t('action.update') : t('action.create')}
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              {t('action.cancel')}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}
