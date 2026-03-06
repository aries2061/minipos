'use client';

import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { FiGlobe } from 'react-icons/fi';
import { useTranslation, languages, type Language } from '@/lib/i18n';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === language)!;
  const isDefault = language === 'en';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setOpen(false);
  };

  return (
    <Box position="relative" ref={ref}>
      <Flex
        as="button"
        align="center"
        gap={1.5}
        px={2}
        py={1}
        borderRadius="md"
        border="1px solid"
        borderColor={isDefault ? 'gray.300' : 'blue.400'}
        bg={isDefault ? 'transparent' : 'blue.50'}
        _hover={{ borderColor: isDefault ? 'gray.400' : 'blue.500' }}
        onClick={() => setOpen(!open)}
        cursor="pointer"
      >
        {isDefault ? (
          <>
            <Text fontSize="xs" color="gray.600">English</Text>
            <Icon as={FiGlobe} boxSize={4} color="gray.600" />
          </>
        ) : (
          <Text fontSize="xs" fontWeight="bold" color="blue.600">
            {current.shortCode}
          </Text>
        )}
      </Flex>

      {open && (
        <Box
          position="absolute"
          top="100%"
          right={0}
          mt={1}
          bg="white"
          borderRadius="md"
          shadow="lg"
          border="1px solid"
          borderColor="gray.200"
          zIndex={20}
          minW="140px"
          overflow="hidden"
        >
          {languages.map((lang) => (
            <Flex
              key={lang.code}
              as="button"
              w="full"
              px={3}
              py={2}
              align="center"
              justify="space-between"
              _hover={{ bg: 'gray.50' }}
              bg={language === lang.code ? 'blue.50' : 'transparent'}
              onClick={() => handleSelect(lang.code)}
              cursor="pointer"
            >
              <Text fontSize="sm" fontWeight={language === lang.code ? 'bold' : 'normal'}>
                {lang.label}
              </Text>
              <Text fontSize="xs" color="gray.500">{lang.shortCode}</Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
}
