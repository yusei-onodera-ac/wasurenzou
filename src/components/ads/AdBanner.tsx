import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { useEntitlementStore } from '../../store/useEntitlementStore';
import { AD_UNIT_IDS } from '../../services/ads';

export function AdBanner() {
  const isPremium = useEntitlementStore((state) => state.isPremium);

  if (isPremium) return null;

  return (
    <View style={styles.wrap}>
      <BannerAd unitId={AD_UNIT_IDS.banner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
});
