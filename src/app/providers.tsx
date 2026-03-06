'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/lib/i18n';
import { SettingsProvider } from '@/lib/settings';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <SettingsProvider>
          <ChakraProvider value={defaultSystem}>
            {children}
          </ChakraProvider>
        </SettingsProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
