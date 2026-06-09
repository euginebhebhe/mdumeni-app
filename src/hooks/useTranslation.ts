// src/hooks/useTranslation.ts
// Returns a translation function pre-bound to the farmer's language
// Usage:
//   const { t } = useTranslation();
//   <Text>{t('home.greeting')}</Text>
//   <Text>{t('home.days_planted', { days: 35 })}</Text>

import { useAppStore } from '@/store';
import { t as translate, type TranslationKey } from '@/i18n';

export function useTranslation() {
  // Language switching is disabled — app runs in English only.
  // Shona/Ndebele translations are available in i18n/index.ts and can be
  // re-enabled here when a full agronomic review of the translations is complete.
  return {
    lang: 'english' as const,
    t: (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate('english', key, vars),
  };
}