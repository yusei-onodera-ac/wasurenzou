import type { AdService, RewardedAdResult } from './adService';

const MOCK_AD_DURATION_MS = 1200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const adServiceMock: AdService = {
  async showRewardedAd() {
    await delay(MOCK_AD_DURATION_MS);
    return { earnedReward: true } satisfies RewardedAdResult;
  },
};
