'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Button, VStack, HStack, Text, Input, Badge, Flex } from '@chakra-ui/react';
import { Item } from '@prisma/client';
import { createSale } from '@/actions/sales';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { useSettings } from '@/lib/settings';
import type { CartItem } from '@/types';

interface Customer {
  id: string;
  name: string;
  phone: string | null;
}

interface CartProps {
  items: Item[];
  customers: Customer[];
}

export default function Cart({ items, customers }: CartProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'digital' | 'debt'>('cash');
  const [debtorName, setDebtorName] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useTranslation();
  const { settings } = useSettings();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCustomers = debtorName.trim()
    ? customers.filter((c) =>
        c.name.toLowerCase().includes(debtorName.toLowerCase())
      )
    : customers;

  const isNewCustomer = debtorName.trim() &&
    !customers.some((c) => c.name.toLowerCase() === debtorName.trim().toLowerCase());

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) return prev;
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      if (item.stock <= 0) return prev;
      return [...prev, { id: item.id, name: item.name, salePrice: item.salePrice, costPrice: item.costPrice, stock: item.stock, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== id));
      return;
    }
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: Math.min(qty, c.stock) } : c))
    );
  };

  const total = cart.reduce((sum, c) => sum + c.salePrice * c.quantity, 0);
  const costTotal = cart.reduce((sum, c) => sum + c.costPrice * c.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (paymentMode === 'debt' && !debtorName.trim()) {
      setError(t('sales.debtorRequired'));
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createSale({
        items: cart.map((c) => ({
          itemId: c.id,
          quantity: c.quantity,
          price: c.salePrice,
          costPrice: c.costPrice,
        })),
        totalAmount: total,
        costTotal,
        paymentMode,
        debtorName: paymentMode === 'debt' ? debtorName.trim() : undefined,
      });
      setCart([]);
      setDebtorName('');
      setSuccess(t('sales.success'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex gap={6} direction={{ base: 'column', lg: 'row' }}>
      {/* Item Selection */}
      <Box flex={1}>
        <Input
          placeholder={t('sales.searchItems')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="sm"
          mb={4}
        />
        <VStack align="stretch" gap={2} maxH="500px" overflowY="auto">
          {filteredItems.map((item) => (
            <Flex
              key={item.id}
              p={3}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              justify="space-between"
              align="center"
              cursor={item.stock > 0 ? 'pointer' : 'not-allowed'}
              opacity={item.stock > 0 ? 1 : 0.5}
              _hover={item.stock > 0 ? { borderColor: 'blue.300' } : {}}
              onClick={() => item.stock > 0 && addToCart(item)}
            >
              <Box>
                <Text fontSize="sm" fontWeight="medium">{item.name}</Text>
                <Text fontSize="xs" color="gray.500">{item.category}</Text>
              </Box>
              <HStack gap={3}>
                <Text fontSize="sm" fontWeight="semibold">{formatCurrency(item.salePrice, settings.currency)}</Text>
                <Badge colorScheme={item.stock <= 5 ? 'red' : 'green'} fontSize="xs">
                  {t('sales.stock')}: {item.stock}
                </Badge>
              </HStack>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Cart */}
      <Box w={{ base: 'full', lg: '380px' }} bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200">
        <Text fontSize="lg" fontWeight="semibold" mb={4}>{t('sales.cart')} ({cart.length} {t('sales.items')})</Text>
        <VStack align="stretch" gap={2} mb={4} maxH="250px" overflowY="auto">
          {cart.length === 0 ? (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
              {t('sales.emptyCart')}
            </Text>
          ) : (
            cart.map((c) => (
              <Flex key={c.id} justify="space-between" align="center" py={1}>
                <Box>
                  <Text fontSize="sm">{c.name}</Text>
                  <Text fontSize="xs" color="gray.500">{formatCurrency(c.salePrice, settings.currency)} </Text>
                </Box>
                <HStack gap={2}>
                  <Button size="xs" onClick={() => updateQuantity(c.id, c.quantity - 1)}>-</Button>
                  <Text fontSize="sm" w="24px" textAlign="center">{c.quantity}</Text>
                  <Button size="xs" onClick={() => updateQuantity(c.id, c.quantity + 1)}>+</Button>
                  <Text fontSize="sm" fontWeight="medium" w="60px" textAlign="right">
                    {formatCurrency(c.salePrice * c.quantity, settings.currency)}
                  </Text>
                </HStack>
              </Flex>
            ))
          )}
        </VStack>

        <Box borderTop="1px solid" borderColor="gray.200" pt={4}>
          <Flex justify="space-between" mb={4}>
            <Text fontWeight="semibold">{t('sales.total')}</Text>
            <Text fontWeight="bold" fontSize="lg">{formatCurrency(total, settings.currency)}</Text>
          </Flex>

          <Text fontSize="sm" mb={2}>{t('sales.paymentMode')}</Text>
          <HStack gap={2} mb={4}>
            {(['cash', 'digital', 'debt'] as const).map((mode) => {
              const modeLabels = { cash: t('sales.cash'), digital: t('sales.digital'), debt: t('sales.debt') };
              return (
                <Button
                  key={mode}
                  size="sm"
                  variant={paymentMode === mode ? 'solid' : 'outline'}
                  colorScheme={paymentMode === mode ? 'blue' : 'gray'}
                  onClick={() => setPaymentMode(mode)}
                >
                  {modeLabels[mode]}
                </Button>
              );
            })}
          </HStack>

          {paymentMode === 'debt' && (
            <Box mb={4} ref={suggestionsRef} position="relative">
              <Text fontSize="sm" mb={1}>{t('sales.debtorName')}</Text>
              <Input
                size="sm"
                value={debtorName}
                onChange={(e) => {
                  setDebtorName(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t('sales.enterDebtorName')}
              />
              {showSuggestions && debtorName.trim() && (
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
                  maxH="200px"
                  overflowY="auto"
                  mt={1}
                >
                  {filteredCustomers.map((c) => (
                    <Box
                      key={c.id}
                      px={3}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: 'blue.50' }}
                      onClick={() => {
                        setDebtorName(c.name);
                        setShowSuggestions(false);
                      }}
                    >
                      <Text fontSize="sm">{c.name}</Text>
                      {c.phone && <Text fontSize="xs" color="gray.500">{c.phone}</Text>}
                    </Box>
                  ))}
                  {isNewCustomer && (
                    <Box
                      px={3}
                      py={2}
                      cursor="pointer"
                      _hover={{ bg: 'green.50' }}
                      borderTop={filteredCustomers.length > 0 ? '1px solid' : 'none'}
                      borderColor="gray.100"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <Text fontSize="sm" color="green.600" fontWeight="medium">
                        + {t('sales.addAsNewCustomer' as never)} &quot;{debtorName.trim()}&quot;
                      </Text>
                    </Box>
                  )}
                  {filteredCustomers.length === 0 && !isNewCustomer && (
                    <Box px={3} py={2}>
                      <Text fontSize="sm" color="gray.500">{t('search.noResults')}</Text>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}

          {error && <Text color="red.500" fontSize="sm" mb={2}>{error}</Text>}
          {success && <Text color="green.500" fontSize="sm" mb={2}>{success}</Text>}

          <Button
            w="full"
            colorScheme="blue"
            onClick={handleCheckout}
            loading={loading}
            disabled={cart.length === 0}
          >
            {t('sales.completeSale')}
          </Button>
        </Box>
      </Box>
    </Flex>
  );
}
