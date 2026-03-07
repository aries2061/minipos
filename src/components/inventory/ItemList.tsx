'use client';

import { useState } from 'react';
import { Box, Button, HStack, Badge, Icon, Text, Flex } from '@chakra-ui/react';
import { Item } from '@prisma/client';
import DataTable from '@/components/ui/DataTable';
import ItemForm from './ItemForm';
import StockHistory from './StockHistory';
import CategoryList from './CategoryList';
import { iconMap } from './IconPicker';
import { deleteItem } from '@/actions/inventory';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface Category {
  id: string;
  name: string;
  icon: string;
  _count: { items: number };
}

interface ItemListProps {
  items: Item[];
  categories: Category[];
}

export default function ItemList({ items, categories }: ItemListProps) {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const { t } = useTranslation();
  const { settings } = useSettings();

  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name, icon: c.icon }));

  const getCategoryIcon = (categoryName: string) => {
    const cat = categories.find((c) => c.name === categoryName);
    if (cat && iconMap[cat.icon]) return iconMap[cat.icon];
    return null;
  };

  const columns = [
    { header: t('table.name'), accessor: 'name' as const },
    {
      header: t('table.category'),
      accessor: (row: Item) => {
        const IconComp = getCategoryIcon(row.category);
        return (
          <HStack gap={1}>
            {IconComp && <Icon as={IconComp} boxSize={4} color="blue.500" />}
            <Text fontSize="sm">{row.category}</Text>
          </HStack>
        );
      },
    },
    {
      header: t('table.cost'),
      accessor: (row: Item) => formatCurrency(row.costPrice, settings.currency),
    },
    {
      header: t('table.salePrice'),
      accessor: (row: Item) => formatCurrency(row.salePrice, settings.currency),
    },
    {
      header: t('table.stock'),
      accessor: (row: Item) => (
        <Badge colorScheme={row.stock <= 5 ? 'red' : row.stock <= 20 ? 'yellow' : 'green'}>
          {row.stock}
        </Badge>
      ),
    },
    { header: t('table.sku'), accessor: (row: Item) => row.sku || '-' },
    {
      header: t('table.actions'),
      accessor: (row: Item) => (
        <HStack gap={2}>
          <Button
            size="xs"
            variant="outline"
            colorScheme="teal"
            onClick={() => setExpandedItemId(expandedItemId === row.id ? null : row.id)}
          >
            {t('inventory.stockHistory' as TranslationKey)}
          </Button>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              setEditingItem(row);
              setShowForm(true);
            }}
          >
            {t('action.edit')}
          </Button>
          <Button
            size="xs"
            colorScheme="red"
            variant="outline"
            onClick={async () => {
              if (confirm(t('inventory.deleteConfirm'))) {
                await deleteItem(row.id);
              }
            }}
          >
            {t('action.delete')}
          </Button>
        </HStack>
      ),
    },
  ];

  return (
    <Box>
      {showForm && (
        <Box mb={4}>
          <ItemForm
            item={editingItem || undefined}
            categories={categoryOptions}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </Box>
      )}
      {!showForm && (
        <Flex mb={4} gap={2}>
          <Button size="sm" colorScheme="blue" onClick={() => setShowForm(true)}>
            {t('inventory.addItem')}
          </Button>
          <Button
            size="sm"
            variant={showCategories ? 'solid' : 'outline'}
            colorScheme="teal"
            onClick={() => setShowCategories(!showCategories)}
          >
            {t('inventory.categories' as TranslationKey)}
          </Button>
        </Flex>
      )}
      {showCategories && !showForm && (
        <Box mb={4} p={4} bg="gray.50" borderRadius="lg">
          <CategoryList categories={categories} />
        </Box>
      )}
      <DataTable columns={columns} data={items} emptyMessage={t('inventory.emptyMessage')} />
      {expandedItemId && (() => {
        const item = items.find((i) => i.id === expandedItemId);
        if (!item) return null;
        return (
          <Box mt={4} p={4} bg="white" borderRadius="lg" border="1px solid" borderColor="gray.200">
            <StockHistory itemId={item.id} itemName={item.name} />
          </Box>
        );
      })()}
    </Box>
  );
}
