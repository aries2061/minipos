'use client';

import { Box, VStack, Text, HStack, Button, Flex, Input } from '@chakra-ui/react';
import { useTranslation } from '@/lib/i18n';
import { languages, type Language } from '@/lib/i18n';
import { useSettings, type Currency } from '@/lib/settings';
import type { TranslationKey } from '@/lib/i18n/translations/en';

const currencies: { code: Currency; label: string }[] = [
  { code: 'USD', label: 'USD ($)' },
  { code: 'MMK', label: 'MMK (K)' },
  { code: 'THB', label: 'THB (฿)' },
];

const DEFAULT_THEME = {
  primary: '#3182CE',
  secondary: '#718096',
  text: '#1A202C',
};

export default function SettingsContent() {
  const { t } = useTranslation();
  const { settings, updateSettings } = useSettings();
  const { setLanguage } = useTranslation();

  const handleLanguageChange = (lang: Language) => {
    updateSettings({ defaultLanguage: lang });
    setLanguage(lang);
  };

  const handleCurrencyChange = (currency: Currency) => {
    updateSettings({ currency });
  };

  const handleThemeChange = (key: 'primary' | 'secondary' | 'text', value: string) => {
    updateSettings({ theme: { ...settings.theme, [key]: value } });
  };

  const resetTheme = () => {
    updateSettings({ theme: DEFAULT_THEME });
  };

  return (
    <Box maxW="600px">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>{t('settings.title' as TranslationKey)}</Text>

      <VStack align="stretch" gap={6}>
        {/* Language Setting */}
        <Box bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="semibold" mb={1}>{t('settings.language' as TranslationKey)}</Text>
          <Text fontSize="sm" color="gray.500" mb={3}>{t('settings.languageDesc' as TranslationKey)}</Text>
          <HStack gap={2}>
            {languages.map((lang) => (
              <Button
                key={lang.code}
                size="sm"
                variant={settings.defaultLanguage === lang.code ? 'solid' : 'outline'}
                colorScheme={settings.defaultLanguage === lang.code ? 'blue' : 'gray'}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.label}
              </Button>
            ))}
          </HStack>
        </Box>

        {/* Currency Setting */}
        <Box bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Text fontWeight="semibold" mb={1}>{t('settings.currency' as TranslationKey)}</Text>
          <Text fontSize="sm" color="gray.500" mb={3}>{t('settings.currencyDesc' as TranslationKey)}</Text>
          <HStack gap={2}>
            {currencies.map((cur) => (
              <Button
                key={cur.code}
                size="sm"
                variant={settings.currency === cur.code ? 'solid' : 'outline'}
                colorScheme={settings.currency === cur.code ? 'blue' : 'gray'}
                onClick={() => handleCurrencyChange(cur.code)}
              >
                {cur.label}
              </Button>
            ))}
          </HStack>
        </Box>

        {/* Theme Color Setting */}
        <Box bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Flex justify="space-between" align="center" mb={1}>
            <Text fontWeight="semibold">{t('settings.theme' as TranslationKey)}</Text>
            <Button size="xs" variant="ghost" onClick={resetTheme}>
              {t('settings.resetTheme' as TranslationKey)}
            </Button>
          </Flex>
          <Text fontSize="sm" color="gray.500" mb={4}>{t('settings.themeDesc' as TranslationKey)}</Text>
          <VStack align="stretch" gap={3}>
            {([
              { key: 'primary' as const, labelKey: 'settings.primaryColor' as TranslationKey },
              { key: 'secondary' as const, labelKey: 'settings.secondaryColor' as TranslationKey },
              { key: 'text' as const, labelKey: 'settings.textColor' as TranslationKey },
            ]).map((item) => (
              <Flex key={item.key} align="center" justify="space-between">
                <Text fontSize="sm">{t(item.labelKey)}</Text>
                <HStack gap={2}>
                  <Input
                    type="color"
                    value={settings.theme[item.key]}
                    onChange={(e) => handleThemeChange(item.key, e.target.value)}
                    w="40px"
                    h="40px"
                    p={1}
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    cursor="pointer"
                  />
                  <Text fontSize="xs" color="gray.500" fontFamily="mono" w="70px">
                    {settings.theme[item.key]}
                  </Text>
                </HStack>
              </Flex>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
