import { iapServiceMock } from './iapService.mock';
import type { IapService } from './iapService';

export const iapService: IapService = iapServiceMock;

export type { Product, ProductId } from './products';
export { PRODUCTS } from './products';
export type { PurchaseResult } from './iapService';
