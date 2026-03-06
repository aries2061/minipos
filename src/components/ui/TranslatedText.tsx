'use client';

import { Text, type TextProps } from '@chakra-ui/react';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

interface TranslatedTextProps extends TextProps {
  tKey: TranslationKey;
}

export default function TranslatedText({ tKey, ...props }: TranslatedTextProps) {
  const { t } = useTranslation();
  return <Text {...props}>{t(tKey)}</Text>;
}
