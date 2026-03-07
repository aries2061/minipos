import type { Metadata } from 'next';
import { Providers } from './providers';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import ResponsiveMain from '@/components/layout/ResponsiveMain';
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
            <ResponsiveMain>
              <Navbar />
              <Box as="main" p={{ base: 3, md: 4, lg: 6 }}>
                {children}
              </Box>
            </ResponsiveMain>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
