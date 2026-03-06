'use client';

import { useState } from 'react';
import { Box, Button, HStack, Badge } from '@chakra-ui/react';
import { Item } from '@prisma/client';
import DataTable from '@/components/ui/DataTable';
import ItemForm from './ItemForm';
import { deleteItem } from '@/actions/inventory';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface ItemListProps {
  items: Item[];
}

export default function ItemList({ items }: ItemListProps) {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { t } = useTranslation();

  const columns = [
    { header: t('table.name'), accessor: 'name' as const },
    { header: t('table.category'), accessor: 'category' as const },
    {
      header: t('table.cost'),
      accessor: (row: Item) => formatCurrency(row.costPrice),
    },
    {
      header: t('table.salePrice'),
      accessor: (row: Item) => formatCurrency(row.salePrice),
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
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </Box>
      )}
      {!showForm && (
        <Box mb={4}>
          <Button size="sm" colorScheme="blue" onClick={() => setShowForm(true)}>
            {t('inventory.addItem')}
          </Button>
        </Box>
      )}
      <DataTable columns={columns} data={items} emptyMessage={t('inventory.emptyMessage')} />
    </Box>
  );
}
