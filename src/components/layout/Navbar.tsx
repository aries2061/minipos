'use client';

import { Flex, Text, Button, Box } from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import CommandSearch from '@/components/ui/CommandSearch';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n';

export default function Navbar() {
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={6}
        py={3}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex align="center" gap={4}>
          <Box
            as="button"
            onClick={() => setSearchOpen(true)}
            px={3}
            py={1.5}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.300"
            fontSize="sm"
            color="gray.500"
            _hover={{ borderColor: 'gray.400' }}
          >
            {t('search.placeholder')}
          </Box>
        </Flex>
        <Flex align="center" gap={3}>
          <LanguageSwitcher />
          {session?.user ? (
            <>
              <Text fontSize="sm">{session.user.name || session.user.email}</Text>
              <Button size="sm" variant="outline" onClick={() => signOut()}>
                {t('auth.signOut')}
              </Button>
            </>
          ) : (
            <Button size="sm" colorScheme="blue" onClick={() => signIn('google')}>
              {t('auth.signIn')}
            </Button>
          )}
        </Flex>
      </Flex>
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
