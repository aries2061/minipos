'use client';

import { Input, Box } from '@chakra-ui/react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface SearchInputProps {
  placeholder?: string;
  placeholderKey?: TranslationKey;
}

export default function SearchInput({ placeholder, placeholderKey }: SearchInputProps) {
  const { t } = useTranslation();
  const displayPlaceholder = placeholderKey ? t(placeholderKey) : placeholder || 'Search...';
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
        placeholder={displayPlaceholder}
        defaultValue={searchParams.get('q') || ''}
        onChange={(e) => handleSearch(e.target.value)}
        size="sm"
        borderRadius="md"
      />
    </Box>
  );
}
