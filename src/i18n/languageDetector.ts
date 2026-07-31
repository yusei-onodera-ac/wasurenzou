import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import type { LanguageDetectorAsyncModule } from 'i18next';

import { SETTINGS_STORAGE_KEY } from '../store/useSettingsStore';
import { SUPPORTED_LOCALE_CODES, FALLBACK_LOCALE_CODE, type SupportedLocaleCode } from './locales';

function isSupportedLocaleCode(value: unknown): value is SupportedLocaleCode {
  return typeof value === 'string' && (SUPPORTED_LOCALE_CODES as readonly string[]).includes(value);
}

export function resolveSystemLocale(): SupportedLocaleCode {
  const [primary] = Localization.getLocales();
  return isSupportedLocaleCode(primary?.languageCode) ? primary.languageCode : FALLBACK_LOCALE_CODE;
}

export const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: async (callback) => {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      const override = raw ? JSON.parse(raw)?.state?.languageOverride : 'system';
      if (isSupportedLocaleCode(override)) {
        callback(override);
        return;
      }
    } catch {
      // AsyncStorage unavailable or malformed data — fall back to system locale below.
    }
    callback(resolveSystemLocale());
  },
  cacheUserLanguage: () => {},
};
