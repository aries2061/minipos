'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ChakraProvider value={defaultSystem}>
          {children}
        </ChakraProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
