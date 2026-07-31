export type ProductId = 'premium_monthly' | 'premium_yearly';

export interface Product {
  id: ProductId;
  priceLabel: string;
  periodLabel: 'month' | 'year';
}

export const PRODUCTS: Product[] = [
  { id: 'premium_monthly', priceLabel: '¥200', periodLabel: 'month' },
  { id: 'premium_yearly', priceLabel: '¥1,000', periodLabel: 'year' },
];
