'use client';

import { Box, VStack, Text, Flex, Icon, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPackage, FiShoppingCart, FiBarChart2, FiDollarSign, FiUsers, FiSettings } from 'react-icons/fi';
import { useTranslation } from '@/lib/i18n';
import { useSidebar } from '@/lib/sidebar';
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

const SIDEBAR_FULL = '240px';
const SIDEBAR_COLLAPSED = '64px';

export { SIDEBAR_FULL, SIDEBAR_COLLAPSED };

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { isOpen, isCollapsed, close } = useSidebar();

  // Determine if we're on mobile (sidebar as overlay)
  const isMobileOverlay = isOpen;
  const showLabels = !isCollapsed;
  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOverlay && (
        <Box
          position="fixed"
          inset={0}
          bg="blackAlpha.600"
          zIndex={19}
          onClick={close}
          display={{ base: 'block', md: 'none' }}
        />
      )}

      <Box
        as="nav"
        w={sidebarWidth}
        minH="100vh"
        bg="gray.900"
        color="white"
        py={6}
        px={isCollapsed ? 2 : 4}
        position="fixed"
        left={0}
        top={0}
        zIndex={20}
        transition="all 0.2s ease"
        transform={{
          base: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          md: 'translateX(0)',
        }}
        overflowX="hidden"
      >
        <Flex align="center" gap={2} mb={8} px={isCollapsed ? 0 : 3} justify={isCollapsed ? 'center' : 'flex-start'}>
          <Image src="/logo.jpeg" alt="MiniPOS" boxSize={isCollapsed ? '32px' : '36px'} borderRadius="md" flexShrink={0} />
          {showLabels && <Text fontSize="xl" fontWeight="bold">MiniPOS</Text>}
        </Flex>
        <VStack gap={1} align="stretch">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={close}>
                <Flex
                  align="center"
                  gap={3}
                  px={isCollapsed ? 0 : 3}
                  py={2}
                  borderRadius="md"
                  bg={isActive ? 'var(--minipos-primary, #3182CE)' : 'transparent'}
                  _hover={{ bg: isActive ? 'var(--minipos-primary, #3182CE)' : 'gray.700' }}
                  cursor="pointer"
                  justify={isCollapsed ? 'center' : 'flex-start'}
                  title={isCollapsed ? t(item.labelKey) : undefined}
                >
                  <Icon as={item.icon} boxSize={5} flexShrink={0} />
                  {showLabels && (
                    <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'normal'} whiteSpace="nowrap">
                      {t(item.labelKey)}
                    </Text>
                  )}
                </Flex>
              </Link>
            );
          })}
        </VStack>
      </Box>
    </>
  );
}
