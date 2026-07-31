import type { Product, ProductId } from './products';

export interface PurchaseResult {
  success: boolean;
}

export interface IapService {
  initialize(): Promise<void>;
  getProducts(): Promise<Product[]>;
  purchase(productId: ProductId): Promise<PurchaseResult>;
  restorePurchases(): Promise<PurchaseResult>;
}
