'use client';

import { Box, VStack, Text, Flex, Icon } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPackage, FiShoppingCart, FiBarChart2, FiDollarSign } from 'react-icons/fi';

const navItems = [
  { label: 'Dashboard', href: '/', icon: FiHome },
  { label: 'Inventory', href: '/inventory', icon: FiPackage },
  { label: 'Sales', href: '/sales', icon: FiShoppingCart },
  { label: 'Analytics', href: '/analytics', icon: FiBarChart2 },
  { label: 'Debts', href: '/debts', icon: FiDollarSign },
];

export default function Sidebar() {
  const pathname = usePathname();

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
      <Text fontSize="xl" fontWeight="bold" mb={8} px={3}>
        MiniPOS
      </Text>
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
                bg={isActive ? 'blue.600' : 'transparent'}
                _hover={{ bg: isActive ? 'blue.600' : 'gray.700' }}
                cursor="pointer"
              >
                <Icon as={item.icon} boxSize={5} />
                <Text fontSize="sm" fontWeight={isActive ? 'semibold' : 'normal'}>
                  {item.label}
                </Text>
              </Flex>
            </Link>
          );
        })}
      </VStack>
    </Box>
  );
}
