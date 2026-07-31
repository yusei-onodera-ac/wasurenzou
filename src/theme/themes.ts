export interface ThemePalette {
  id: string;
  isPremium: boolean;
  background: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  surface: string;
  swatchPreview: [string, string, string];
  blobColors: [string, string, string];
}

export const DEFAULT_THEME_ID = 'default';

export const THEMES: ThemePalette[] = [
  {
    id: 'default',
    isPremium: false,
    background: '#FFF7FB',
    accent: '#FF8FC7',
    textPrimary: '#4A4458',
    textSecondary: '#8A8296',
    surface: '#FFFFFF',
    swatchPreview: ['#FFF7FB', '#FF8FC7', '#FFC1E3'],
    blobColors: ['#FFD6EC', '#C7DBFF', '#E4C9FF'],
  },
  {
    id: 'ocean',
    isPremium: true,
    background: '#EAF6FB',
    accent: '#4FB6E0',
    textPrimary: '#234B5C',
    textSecondary: '#5C7C8A',
    surface: '#FFFFFF',
    swatchPreview: ['#EAF6FB', '#4FB6E0', '#B7E3F2'],
    blobColors: ['#B7E3F2', '#CFEFFB', '#9FD8F0'],
  },
  {
    id: 'lavender',
    isPremium: true,
    background: '#F1ECFB',
    accent: '#8B6FD9',
    textPrimary: '#4A3F6B',
    textSecondary: '#7A6F94',
    surface: '#FFFFFF',
    swatchPreview: ['#F1ECFB', '#8B6FD9', '#D5C7F5'],
    blobColors: ['#D5C7F5', '#E4D9FA', '#C0AEF0'],
  },
  {
    id: 'sunset',
    isPremium: true,
    background: '#FFF1E6',
    accent: '#FF8B5C',
    textPrimary: '#6B3F2E',
    textSecondary: '#9B7862',
    surface: '#FFFFFF',
    swatchPreview: ['#FFF1E6', '#FF8B5C', '#FFC9A8'],
    blobColors: ['#FFC9A8', '#FFDCC2', '#FFB088'],
  },
  {
    id: 'mint',
    isPremium: true,
    background: '#EAF9F0',
    accent: '#3FC98A',
    textPrimary: '#234B3A',
    textSecondary: '#5C8C74',
    surface: '#FFFFFF',
    swatchPreview: ['#EAF9F0', '#3FC98A', '#B8ECD0'],
    blobColors: ['#B8ECD0', '#D3F5E2', '#8FE0B8'],
  },
  {
    id: 'sakura',
    isPremium: true,
    background: '#FFF0F5',
    accent: '#FF6FA5',
    textPrimary: '#6B2F45',
    textSecondary: '#9B6478',
    surface: '#FFFFFF',
    swatchPreview: ['#FFF0F5', '#FF6FA5', '#FFC1D9'],
    blobColors: ['#FFC1D9', '#FFDCE9', '#FF9FC2'],
  },
];

export function getTheme(id: string): ThemePalette {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0];
}
