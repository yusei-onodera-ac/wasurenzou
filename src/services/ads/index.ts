import { adServiceMock } from './adService.mock';
import type { AdService } from './adService';

/**
 * Real ad-network implementation (AdMob or an affiliate network) needs the
 * user's own ad account + ad unit IDs plus a native SDK install (EAS dev
 * client, won't run in Expo Go). Until that's wired up, this points at the
 * mock so the banner/rewarded-ad UI and revive flow are fully demoable.
 */
export const adService: AdService = adServiceMock;
