import type { IapService } from './iapService';

/**
 * Real store-connected implementation, wired up once react-native-iap is
 * installed (requires EAS dev client — won't run in Expo Go) and the
 * matching products exist in App Store Connect / Play Console. Until then
 * this stays a stub; `src/services/iap/index.ts` points at the mock.
 */
export const iapServiceNative: IapService = {
  async initialize() {
    throw new Error('iapServiceNative is not implemented yet — see src/services/iap/iapService.native.ts');
  },
  async getProducts() {
    throw new Error('iapServiceNative is not implemented yet — see src/services/iap/iapService.native.ts');
  },
  async purchase() {
    throw new Error('iapServiceNative is not implemented yet — see src/services/iap/iapService.native.ts');
  },
  async restorePurchases() {
    throw new Error('iapServiceNative is not implemented yet — see src/services/iap/iapService.native.ts');
  },
};
