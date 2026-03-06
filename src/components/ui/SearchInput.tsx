'use client';

import { Input, Box } from '@chakra-ui/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

interface SearchInputProps {
  placeholder?: string;
}

export default function SearchInput({ placeholder = 'Search...' }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <Box maxW="400px">
      <Input
        placeholder={placeholder}
        defaultValue={searchParams.get('q') || ''}
        onChange={(e) => handleSearch(e.target.value)}
        size="sm"
        borderRadius="md"
      />
    </Box>
  );
}
