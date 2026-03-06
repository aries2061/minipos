'use client';

import { useState } from 'react';
import { Box, Button, HStack } from '@chakra-ui/react';
import { Customer } from '@prisma/client';
import DataTable from '@/components/ui/DataTable';
import CustomerForm from './CustomerForm';
import { deleteCustomer } from '@/actions/customers';
import { useTranslation } from '@/lib/i18n';

interface CustomerListProps {
  customers: Customer[];
}

export default function CustomerList({ customers }: CustomerListProps) {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { t } = useTranslation();

  const columns = [
    { header: t('table.name'), accessor: 'name' as const },
    { header: t('table.phone'), accessor: (row: Customer) => row.phone || '-' },
    {
      header: t('table.actions'),
      accessor: (row: Customer) => (
        <HStack gap={2}>
          <Button
            size="xs"
            variant="outline"
            onClick={() => {
              setEditingCustomer(row);
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
              if (confirm(t('customers.deleteConfirm'))) {
                await deleteCustomer(row.id);
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
          <CustomerForm
            customer={editingCustomer || undefined}
            onClose={() => {
              setShowForm(false);
              setEditingCustomer(null);
            }}
          />
        </Box>
      )}
      {!showForm && (
        <Box mb={4}>
          <Button size="sm" colorScheme="blue" onClick={() => setShowForm(true)}>
            {t('customers.addCustomer')}
          </Button>
        </Box>
      )}
      <DataTable columns={columns} data={customers} emptyMessage={t('customers.emptyMessage')} />
    </Box>
  );
}
