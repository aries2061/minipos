'use client';

import { Flex, Text, Button, Box, Icon } from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import CommandSearch from '@/components/ui/CommandSearch';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useTranslation } from '@/lib/i18n';
import { useSidebar } from '@/lib/sidebar';

export default function Navbar() {
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const { t } = useTranslation();
  const { toggle } = useSidebar();

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={{ base: 3, md: 4, lg: 6 }}
        py={3}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={10}
        gap={2}
      >
        <Flex align="center" gap={{ base: 2, md: 4 }}>
          <Box
            as="button"
            onClick={toggle}
            display={{ base: 'flex', lg: 'none' }}
            p={2}
            borderRadius="md"
            _hover={{ bg: 'gray.100' }}
          >
            <Icon as={FiMenu} boxSize={5} />
          </Box>
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
            display={{ base: 'none', sm: 'block' }}
          >
            {t('search.placeholder')}
          </Box>
        </Flex>
        <Flex align="center" gap={{ base: 2, md: 3 }}>
          <LanguageSwitcher />
          {session?.user ? (
            <>
              <Text fontSize="sm" display={{ base: 'none', md: 'block' }}>
                {session.user.name || session.user.email}
              </Text>
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
