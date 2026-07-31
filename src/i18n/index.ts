import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAddMemo from './locales/en/addMemo.json';
import enAds from './locales/en/ads.json';
import enCommon from './locales/en/common.json';
import enForgotten from './locales/en/forgotten.json';
import enHelp from './locales/en/help.json';
import enHistory from './locales/en/history.json';
import enHome from './locales/en/home.json';
import enLegal from './locales/en/legal.json';
import enNotifications from './locales/en/notifications.json';
import enPaywall from './locales/en/paywall.json';
import enSettings from './locales/en/settings.json';
import jaAddMemo from './locales/ja/addMemo.json';
import jaAds from './locales/ja/ads.json';
import jaCommon from './locales/ja/common.json';
import jaForgotten from './locales/ja/forgotten.json';
import jaHelp from './locales/ja/help.json';
import jaHistory from './locales/ja/history.json';
import jaHome from './locales/ja/home.json';
import jaLegal from './locales/ja/legal.json';
import jaNotifications from './locales/ja/notifications.json';
import jaPaywall from './locales/ja/paywall.json';
import jaSettings from './locales/ja/settings.json';
import koAddMemo from './locales/ko/addMemo.json';
import koAds from './locales/ko/ads.json';
import koCommon from './locales/ko/common.json';
import koForgotten from './locales/ko/forgotten.json';
import koHelp from './locales/ko/help.json';
import koHistory from './locales/ko/history.json';
import koHome from './locales/ko/home.json';
import koLegal from './locales/ko/legal.json';
import koNotifications from './locales/ko/notifications.json';
import koPaywall from './locales/ko/paywall.json';
import koSettings from './locales/ko/settings.json';
import zhAddMemo from './locales/zh/addMemo.json';
import zhAds from './locales/zh/ads.json';
import zhCommon from './locales/zh/common.json';
import zhForgotten from './locales/zh/forgotten.json';
import zhHelp from './locales/zh/help.json';
import zhHistory from './locales/zh/history.json';
import zhHome from './locales/zh/home.json';
import zhLegal from './locales/zh/legal.json';
import zhNotifications from './locales/zh/notifications.json';
import zhPaywall from './locales/zh/paywall.json';
import zhSettings from './locales/zh/settings.json';
import { languageDetector, resolveSystemLocale } from './languageDetector';
import { useSettingsStore, type LanguageOverride } from '../store/useSettingsStore';

export { SUPPORTED_LOCALES, type SupportedLocaleCode } from './locales';

const resources = {
  en: { common: enCommon, home: enHome, addMemo: enAddMemo, settings: enSettings, notifications: enNotifications, history: enHistory, ads: enAds, paywall: enPaywall, legal: enLegal, forgotten: enForgotten, help: enHelp },
  ja: { common: jaCommon, home: jaHome, addMemo: jaAddMemo, settings: jaSettings, notifications: jaNotifications, history: jaHistory, ads: jaAds, paywall: jaPaywall, legal: jaLegal, forgotten: jaForgotten, help: jaHelp },
  ko: { common: koCommon, home: koHome, addMemo: koAddMemo, settings: koSettings, notifications: koNotifications, history: koHistory, ads: koAds, paywall: koPaywall, legal: koLegal, forgotten: koForgotten, help: koHelp },
  zh: { common: zhCommon, home: zhHome, addMemo: zhAddMemo, settings: zhSettings, notifications: zhNotifications, history: zhHistory, ads: zhAds, paywall: zhPaywall, legal: zhLegal, forgotten: zhForgotten, help: zhHelp },
} as const;

export const i18nReadyPromise = i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'addMemo', 'settings', 'notifications', 'history', 'ads', 'paywall', 'legal', 'forgotten', 'help'],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export async function changeLanguagePreference(override: LanguageOverride): Promise<void> {
  useSettingsStore.getState().setLanguageOverride(override);
  const resolved = override === 'system' ? resolveSystemLocale() : override;
  await i18n.changeLanguage(resolved);
}

export default i18n;
