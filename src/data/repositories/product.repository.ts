import { ProductAbstractRepository } from '../../domain/repositories';
import type { IColor, IProduct, ISize } from '../../domain/types';
import { getSizes, getSize, getProducts, getProduct, getProductColor } from '../../services/api';

export class ProductRepository extends ProductAbstractRepository {
  constructor() {
    super();
  }

  public override getSizes(): Promise<ISize[]> {
    return getSizes();
  }

  public override getSize(sizeId: number): Promise<ISize> {
    return getSize(sizeId);
  }

  public override getProducts(): Promise<IProduct[]> {
    return getProducts();
  }

  public override getProduct(productId: number): Promise<IProduct> {
    return getProduct(productId);
  }

  public override getProductColor(productID: number, colorID: number): Promise<IColor> {
    return getProductColor(productID, colorID);
  }
}
