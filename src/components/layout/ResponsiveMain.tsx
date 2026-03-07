'use client';

import { Box } from '@chakra-ui/react';
import { useSidebar } from '@/lib/sidebar';
import { SIDEBAR_FULL, SIDEBAR_COLLAPSED } from './Sidebar';

export default function ResponsiveMain({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  const marginLeft = isCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

  return (
    <Box
      ml={{ base: 0, md: marginLeft }}
      flex={1}
      bg="gray.50"
      minH="100vh"
      transition="margin-left 0.2s ease"
    >
      {children}
    </Box>
  );
}
