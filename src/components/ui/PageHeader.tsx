'use client';

import { Heading } from '@chakra-ui/react';
import { useTranslation } from '@/lib/i18n';
import type { TranslationKey } from '@/lib/i18n/translations/en';

export default function PageHeader({ titleKey }: { titleKey: TranslationKey }) {
  const { t } = useTranslation();
  return <Heading size="lg">{t(titleKey)}</Heading>;
}
