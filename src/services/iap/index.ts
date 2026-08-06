import { iapServiceNative } from './iapService.native';
import type { IapService } from './iapService';

export const iapService: IapService = iapServiceNative;

export type { Product, ProductId } from './products';
export { PRODUCTS } from './products';
export type { PurchaseResult } from './iapService';
