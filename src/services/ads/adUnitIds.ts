import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Real AdMob ad unit IDs. Only used in production builds — __DEV__ always
 * serves Google's test ads to avoid generating invalid traffic against the
 * real account while developing.
 */
const PRODUCTION_UNIT_IDS = {
  banner: 'ca-app-pub-8128891302717593/1117825876',
  rewarded: 'ca-app-pub-8128891302717593/8229049193',
};

export const AD_UNIT_IDS = {
  banner: __DEV__ ? TestIds.BANNER : PRODUCTION_UNIT_IDS.banner,
  rewarded: __DEV__ ? TestIds.REWARDED : PRODUCTION_UNIT_IDS.rewarded,
};
