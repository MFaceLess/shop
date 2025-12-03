import { ProductAbstractRepository } from '../../domain/repositories';
import type { IColor, IProduct, ISize } from '../../domain/types';
import { getSizes, getSize, getProducts, getProduct, getProductColor } from '../../services/api';

export class ProductRepository extends ProductAbstractRepository {
  private cachedSizes = new Map<number, ISize>();

  constructor() {
    super();
  }

  public override getSizes(): Promise<ISize[]> {
    return getSizes();
  }

  public override getSize(sizeId: number): Promise<ISize> {
    if (this.cachedSizes.has(sizeId)) {
      return Promise.resolve(this.cachedSizes.get(sizeId)!);
    }

    return getSize(sizeId)
      .then(size => {
        this.cachedSizes.set(sizeId, size); 
        return size;
      });
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

export const productRepository = new ProductRepository();
