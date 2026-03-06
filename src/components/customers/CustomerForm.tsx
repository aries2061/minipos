'use client';

import { Box, Button, Input, VStack, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { createCustomer, updateCustomer } from '@/actions/customers';
import { useTranslation } from '@/lib/i18n';

interface CustomerFormProps {
  customer?: {
    id: string;
    name: string;
    phone: string | null;
  };
  onClose: () => void;
}

export default function CustomerForm({ customer, onClose }: CustomerFormProps) {
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
      phone: (formData.get('phone') as string) || undefined,
    };

    try {
      if (customer) {
        await updateCustomer(customer.id, data);
      } else {
        await createCustomer(data);
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
        {customer ? t('customers.editCustomer') : t('customers.addNewCustomer')}
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <HStack gap={4}>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>{t('customers.name')}</Text>
              <Input name="name" defaultValue={customer?.name} required size="sm" />
            </Box>
            <Box flex={1}>
              <Text fontSize="sm" mb={1}>{t('customers.phone')}</Text>
              <Input name="phone" defaultValue={customer?.phone || ''} size="sm" />
            </Box>
          </HStack>
          {error && <Text color="red.500" fontSize="sm">{error}</Text>}
          <HStack gap={2} justify="flex-end">
            <Button size="sm" variant="outline" onClick={onClose}>{t('action.cancel')}</Button>
            <Button size="sm" colorScheme="blue" type="submit" loading={loading}>
              {customer ? t('action.update') : t('action.create')}
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}
