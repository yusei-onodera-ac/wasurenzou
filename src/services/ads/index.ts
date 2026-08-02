import { adServiceNative } from './adService.native';
import type { AdService } from './adService';

export const adService: AdService = adServiceNative;

export { AD_UNIT_IDS } from './adUnitIds';
