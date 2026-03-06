'use client';

import { Box, Input, VStack, Text, Flex } from '@chakra-ui/react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface SearchResult {
  type: 'item' | 'debtor' | 'page';
  label: string;
  href: string;
}

const pageConfigs = [
  { labelKey: 'nav.dashboard' as TranslationKey, href: '/' },
  { labelKey: 'nav.inventory' as TranslationKey, href: '/inventory' },
  { labelKey: 'nav.sales' as TranslationKey, href: '/sales' },
  { labelKey: 'nav.customers' as TranslationKey, href: '/customers' },
  { labelKey: 'nav.analytics' as TranslationKey, href: '/analytics' },
  { labelKey: 'nav.debts' as TranslationKey, href: '/debts' },
];

interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandSearch({ open, onClose }: CommandSearchProps) {
  const { t } = useTranslation();
  const pages: SearchResult[] = useMemo(() =>
    pageConfigs.map((p) => ({ type: 'page' as const, label: t(p.labelKey), href: p.href })),
    [t]
  );
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>(pages);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
        else {
          setQuery('');
          setResults(pages);
        }
      }
      if (e.key === 'Escape' && open) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSearch = useCallback(async (term: string) => {
    setQuery(term);
    if (!term.trim()) {
      setResults(pages);
      return;
    }
    const filtered = pages.filter((p) =>
      p.label.toLowerCase().includes(term.toLowerCase())
    );
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      if (res.ok) {
        const data = await res.json();
        setResults([...filtered, ...data]);
      } else {
        setResults(filtered);
      }
    } catch {
      setResults(filtered);
    }
  }, []);

  const handleSelect = (result: SearchResult) => {
    router.push(result.href);
    onClose();
  };

  if (!open) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      bg="blackAlpha.600"
      zIndex={50}
      onClick={onClose}
    >
      <Box
        maxW="500px"
        mx="auto"
        mt="20vh"
        bg="white"
        borderRadius="lg"
        shadow="xl"
        onClick={(e) => e.stopPropagation()}
        overflow="hidden"
      >
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t('search.commandPlaceholder')}
          size="lg"
          border="none"
          borderBottom="1px solid"
          borderColor="gray.200"
          borderRadius="none"
          _focus={{ boxShadow: 'none' }}
        />
        <VStack align="stretch" maxH="300px" overflowY="auto" p={2} gap={0}>
          {results.map((r, i) => (
            <Flex
              key={i}
              as="button"
              align="center"
              gap={3}
              px={3}
              py={2}
              borderRadius="md"
              _hover={{ bg: 'gray.100' }}
              onClick={() => handleSelect(r)}
              textAlign="left"
            >
              <Text fontSize="xs" color="gray.500" textTransform="uppercase" w="50px">
                {t(`search.type.${r.type}` as TranslationKey)}
              </Text>
              <Text fontSize="sm">{r.label}</Text>
            </Flex>
          ))}
          {results.length === 0 && (
            <Text fontSize="sm" color="gray.500" p={3} textAlign="center">
              {t('search.noResults')}
            </Text>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
