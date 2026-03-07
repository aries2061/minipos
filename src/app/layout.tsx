import type { Metadata } from 'next';
import { Providers } from './providers';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Box, Flex } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'MiniPOS - Mini Store Point of Sale',
  description: 'A mini store POS system for inventory, sales, and debt management',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Flex minH="100vh">
            <Sidebar />
            <Box ml="240px" flex={1} bg="gray.50" minH="100vh">
              <Navbar />
              <Box as="main" p={6}>
                {children}
              </Box>
            </Box>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
