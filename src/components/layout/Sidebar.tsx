'use client';

import { Box, VStack, Text, Flex, Icon, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPackage, FiShoppingCart, FiBarChart2, FiDollarSign, FiUsers, FiSettings } from 'react-icons/fi';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

const navItems = [
  { labelKey: 'nav.dashboard' as TranslationKey, href: '/', icon: FiHome },
  { labelKey: 'nav.inventory' as TranslationKey, href: '/inventory', icon: FiPackage },
  { labelKey: 'nav.sales' as TranslationKey, href: '/sales', icon: FiShoppingCart },
  { labelKey: 'nav.customers' as TranslationKey, href: '/customers', icon: FiUsers },
  { labelKey: 'nav.analytics' as TranslationKey, href: '/analytics', icon: FiBarChart2 },
  { labelKey: 'nav.debts' as TranslationKey, href: '/debts', icon: FiDollarSign },
  { labelKey: 'nav.settings' as TranslationKey, href: '/settings', icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <Box
      as="nav"
      w="240px"
      minH="100vh"
      bg="gray.900"
      color="white"
      py={6}
      px={4}
      position="fixed"
      left={0}
      top={0}
    >
      <Flex align="center" gap={2} mb={8} px={3}>
        <Image src="/logo.jpeg" alt="MiniPOS" boxSize="36px" borderRadius="md" />
        <Text fontSize="xl" fontWeight="bold">MiniPOS</Text>
      </Flex>
      <VStack gap={1} align="stretch">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Flex
                align="center"
                gap={3}
                px={3}
                py={2}
                borderRadius="md"
                bg={isActive ? 'var(--minipos-primary, #3182CE)' : 'transparent'}
                _hover={{ bg: isActive ? 'var(--minipos-primary, #3182CE)' : 'gray.700' }}
                cursor="pointer"
              >
                <Icon as={item.icon} boxSize={5} />
                <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'normal'}>
                  {t(item.labelKey)}
                </Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
}
