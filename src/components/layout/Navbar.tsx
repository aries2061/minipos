'use client';

import { Flex, Text, Button, Box } from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import CommandSearch from '@/components/ui/CommandSearch';

export default function Navbar() {
  const { data: session } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);

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
            Search... ⌘K
          </Box>
        </Flex>
        <Flex align="center" gap={3}>
          {session?.user ? (
            <>
              <Text fontSize="sm">{session.user.name || session.user.email}</Text>
              <Button size="sm" variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" colorScheme="blue" onClick={() => signIn('google')}>
              Sign In
            </Button>
          )}
        </Flex>
      </Flex>
      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
