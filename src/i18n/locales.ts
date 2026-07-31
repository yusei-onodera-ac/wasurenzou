export const SUPPORTED_LOCALES = [
  { code: 'ja', nativeLabel: '日本語' },
  { code: 'en', nativeLabel: 'English' },
  { code: 'ko', nativeLabel: '한국어' },
  { code: 'zh', nativeLabel: '中文' },
] as const;

export const SUPPORTED_LOCALE_CODES = SUPPORTED_LOCALES.map((locale) => locale.code);

export type SupportedLocaleCode = (typeof SUPPORTED_LOCALES)[number]['code'];

export const FALLBACK_LOCALE_CODE: SupportedLocaleCode = 'en';
