import { useThemeStore } from '../store/useThemeStore';
import { useEntitlementStore } from '../store/useEntitlementStore';
import { DEFAULT_THEME_ID, getTheme, type ThemePalette } from './themes';

/** The theme actually applied — falls back to default if the selected
 * theme is premium-only and the user isn't premium. */
export function useThemeColors(): ThemePalette {
  const selectedThemeId = useThemeStore((state) => state.selectedThemeId);
  const isPremium = useEntitlementStore((state) => state.isPremium);
  const theme = getTheme(selectedThemeId);
  if (theme.isPremium && !isPremium) {
    return getTheme(DEFAULT_THEME_ID);
  }
  return theme;
}
