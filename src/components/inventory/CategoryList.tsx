'use client';

import { useState } from 'react';
import { Box, Button, Text, Flex, HStack, Icon, Badge } from '@chakra-ui/react';
import { deleteCategory } from '@/actions/categories';
import { useTranslation } from '@/lib/i18n';
import { iconMap } from './IconPicker';
import CategoryForm from './CategoryForm';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface Category {
  id: string;
  name: string;
  icon: string;
  _count: { items: number };
}

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleDelete = async (cat: Category) => {
    if (cat._count.items > 0) {
      alert(t('inventory.categoryInUse' as TranslationKey));
      return;
    }
    if (!confirm(t('inventory.deleteCategoryConfirm' as TranslationKey))) return;
    await deleteCategory(cat.id);
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="semibold">{t('inventory.categories' as TranslationKey)}</Text>
        {!showForm && !editingCategory && (
          <Button size="sm" colorScheme="blue" onClick={() => setShowForm(true)}>
            {t('inventory.addCategory' as TranslationKey)}
          </Button>
        )}
      </Flex>

      {(showForm || editingCategory) && (
        <CategoryForm
          category={editingCategory || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {categories.length === 0 ? (
        <Text fontSize="sm" color="gray.500">{t('inventory.noCategories' as TranslationKey)}</Text>
      ) : (
        <Flex gap={2} flexWrap="wrap">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon];
            return (
              <Box
                key={cat.id}
                p={3}
                bg="white"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
                minW="160px"
              >
                <HStack gap={2} mb={2}>
                  {IconComponent && <Icon as={IconComponent} boxSize={5} color="blue.500" />}
                  <Text fontSize="sm" fontWeight="medium">{cat.name}</Text>
                  <Badge fontSize="xs">{cat._count.items}</Badge>
                </HStack>
                <HStack gap={1}>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => {
                      setEditingCategory(cat);
                      setShowForm(false);
                    }}
                  >
                    {t('action.edit')}
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    colorScheme="red"
                    onClick={() => handleDelete(cat)}
                  >
                    {t('action.delete')}
                  </Button>
                </HStack>
              </Box>
            );
          })}
        </Flex>
      )}
    </Box>
  );
}
