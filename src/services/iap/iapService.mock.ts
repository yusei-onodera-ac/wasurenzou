import { useEntitlementStore } from '../../store/useEntitlementStore';
import { PRODUCTS } from './products';
import type { IapService, PurchaseResult } from './iapService';

const MOCK_DELAY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const iapServiceMock: IapService = {
  async initialize() {
    // no-op: nothing to connect to in mock mode
  },
  async getProducts() {
    return PRODUCTS;
  },
  async purchase() {
    await delay(MOCK_DELAY_MS);
    useEntitlementStore.getState().setPremium(true);
    return { success: true } satisfies PurchaseResult;
  },
  async restorePurchases() {
    await delay(MOCK_DELAY_MS);
    // Mock has no real receipt to check against; treat restore as a no-op
    // that reports the current locally-persisted entitlement state.
    return { success: useEntitlementStore.getState().isPremium } satisfies PurchaseResult;
  },
};
