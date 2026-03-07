'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/lib/i18n';
import { SettingsProvider } from '@/lib/settings';
import { SidebarProvider } from '@/lib/sidebar';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <SettingsProvider>
          <SidebarProvider>
            <ChakraProvider value={defaultSystem}>
              {children}
            </ChakraProvider>
          </SidebarProvider>
        </SettingsProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
