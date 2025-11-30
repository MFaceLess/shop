import type { IColor, IProduct, ISize } from "../types";

export abstract class ProductAbstractRepository {
  public abstract getSizes(): Promise<ISize[]>;
  public abstract getSize(sizeId: number): Promise<ISize>;
  public abstract getProducts(): Promise<IProduct[]>;
  public abstract getProduct(productId: number): Promise<IProduct>;
  public abstract getProductColor(productID: number, colorID: number): Promise<IColor>;
}
