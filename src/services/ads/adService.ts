export interface RewardedAdResult {
  earnedReward: boolean;
}

export interface AdService {
  showRewardedAd(): Promise<RewardedAdResult>;
}
