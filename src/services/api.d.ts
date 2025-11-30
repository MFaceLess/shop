import type { IColor, IProduct, ISize } from '../domain/types';

export function getSizes(): Promise<ISize[]>;
export function getSize(id: number): Promise<ISize>;
export function getProducts(): Promise<IProduct[]>;
export function getProduct(id: number): Promise<IProduct>;
export function getProductColor(
  productID: number,
  colorID: number
): Promise<IColor>;
