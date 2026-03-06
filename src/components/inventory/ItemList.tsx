'use client';

import { useState } from 'react';
import { Box, Button, HStack, Badge } from '@chakra-ui/react';
import { Item } from '@prisma/client';
import DataTable from '@/components/ui/DataTable';
import ItemForm from './ItemForm';
import { deleteItem } from '@/actions/inventory';
import { formatCurrency } from '@/lib/utils';

interface ItemListProps {
  items: Item[];
}

export default function ItemList({ items }: ItemListProps) {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showForm, setShowForm] = useState(false);

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Category', accessor: 'category' as const },
    {
      header: 'Cost',
      accessor: (row: Item) => formatCurrency(row.costPrice),
    },
    {
      header: 'Sale Price',
      accessor: (row: Item) => formatCurrency(row.salePrice),
    },
    {
      header: 'Stock',
      accessor: (row: Item) => (
        <Badge colorScheme={row.stock <= 5 ? 'red' : row.stock <= 20 ? 'yellow' : 'green'}>
          {row.stock}
        </Badge>
      ),
    },
    { header: 'SKU', accessor: (row: Item) => row.sku || '-' },
    {
      header: 'Actions',
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
            Edit
          </Button>
          <Button
            size="xs"
            colorScheme="red"
            variant="outline"
            onClick={async () => {
              if (confirm('Delete this item?')) {
                await deleteItem(row.id);
              }
            }}
          >
            Delete
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
            + Add Item
          </Button>
        </Box>
      )}
      <DataTable columns={columns} data={items} emptyMessage="No items found. Add your first item!" />
    </Box>
  );
}
