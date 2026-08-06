import {
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestPurchase,
  restorePurchases as expoRestorePurchases,
  type Purchase,
  type ProductSubscription,
} from 'expo-iap';

import { useEntitlementStore } from '../../store/useEntitlementStore';
import { PRODUCTS, type ProductId } from './products';
import type { IapService, PurchaseResult } from './iapService';

const SKUS: ProductId[] = PRODUCTS.map((product) => product.id);

function isOurSku(productId: string): productId is ProductId {
  return SKUS.includes(productId as ProductId);
}

function periodLabelFor(id: ProductId): 'month' | 'year' {
  return id === 'premium_yearly' ? 'year' : 'month';
}

let connectPromise: Promise<void> | null = null;

async function ensureConnection(): Promise<void> {
  if (!connectPromise) {
    connectPromise = initConnection()
      .then(() => {
        // Persistent listener: grants entitlement and finishes transactions for
        // both fresh purchases and unfinished ones StoreKit replays on launch.
        purchaseUpdatedListener(async (purchase: Purchase) => {
          if (isOurSku(purchase.productId)) {
            useEntitlementStore.getState().setPremium(true);
          }
          try {
            await finishTransaction({ purchase, isConsumable: false });
          } catch {
            // best-effort — will be retried/replayed by the store next launch
          }
        });
        purchaseErrorListener(() => {});
      })
      .catch((error) => {
        connectPromise = null;
        throw error;
      });
  }
  return connectPromise;
}

export const iapServiceNative: IapService = {
  async initialize() {
    await ensureConnection();
  },

  async getProducts() {
    await ensureConnection();
    try {
      const result = await fetchProducts({ skus: SKUS, type: 'subs' });
      const subs = (result ?? []) as ProductSubscription[];
      const bySku = new Map(subs.map((item) => [item.id, item]));
      return PRODUCTS.map((fallback) => {
        const match = bySku.get(fallback.id);
        return match
          ? { id: fallback.id, priceLabel: match.displayPrice, periodLabel: periodLabelFor(fallback.id) }
          : fallback;
      });
    } catch {
      return PRODUCTS;
    }
  },

  purchase(productId) {
    return ensureConnection().then(
      () =>
        new Promise<PurchaseResult>((resolve) => {
          let settled = false;
          const settle = (result: PurchaseResult) => {
            if (settled) return;
            settled = true;
            updateSub.remove();
            errorSub.remove();
            resolve(result);
          };

          const updateSub = purchaseUpdatedListener((purchase: Purchase) => {
            if (purchase.productId === productId) settle({ success: true });
          });
          const errorSub = purchaseErrorListener(() => settle({ success: false }));

          requestPurchase({
            request: { apple: { sku: productId }, google: { skus: [productId] } },
            type: 'subs',
          }).catch(() => settle({ success: false }));
        })
    );
  },

  async restorePurchases() {
    await ensureConnection();
    try {
      await expoRestorePurchases();
      const purchases = await getAvailablePurchases();
      const hasPremium = purchases.some((purchase) => isOurSku(purchase.productId));
      if (hasPremium) {
        useEntitlementStore.getState().setPremium(true);
      }
      return { success: hasPremium } satisfies PurchaseResult;
    } catch {
      return { success: false } satisfies PurchaseResult;
    }
  },
};
