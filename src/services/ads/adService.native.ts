import { AdEventType, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

import type { AdService, RewardedAdResult } from './adService';
import { AD_UNIT_IDS } from './adUnitIds';

export const adServiceNative: AdService = {
  showRewardedAd() {
    return new Promise<RewardedAdResult>((resolve) => {
      const rewarded = RewardedAd.createForAdRequest(AD_UNIT_IDS.rewarded);
      let earnedReward = false;
      let settled = false;

      const finish = (result: RewardedAdResult) => {
        if (settled) return;
        settled = true;
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
        resolve(result);
      };

      const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        rewarded.show();
      });
      const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        earnedReward = true;
      });
      const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
        finish({ earnedReward });
      });
      const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, () => {
        finish({ earnedReward: false });
      });

      rewarded.load();
    });
  },
};
