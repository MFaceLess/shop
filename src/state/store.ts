import { makeAutoObservable, runInAction } from 'mobx';
import { ProductRepository } from '../data/repositories';
import type { IProduct, IProductWithSizes, ISize } from '../domain/types';

export class ProductStore {
  public products: IProduct[] = [];
  public loading = false;
  public error: string | null = null;
  public sizes: Map<number, ISize> = new Map();

  private productRepo: ProductRepository;

  constructor() {
    makeAutoObservable(this);
    this.productRepo = new ProductRepository;
  }

  public async fetchProducts() {
    this.loading = true;
    this.error = null;

    try {
      const products = await this.productRepo.getProducts();
      runInAction(() => {
        this.products = products;
        this.loading = false;
      })
    } catch {
      runInAction(() => {
        this.error = 'Failed to fetch products';
        this.loading = false;
      })
    }
  }

  public async loadSizes() {
    const sizes = await this.productRepo.getSizes();

    try {
      runInAction(() => {
        sizes.forEach(size => {
          this.sizes.set(size.id, size);
        })
      })
    } catch {
      runInAction(() => {
        this.error = 'Failed to loadSizes';
      })
    }
  }

  public async loadProduct(productId: number): Promise<IProduct> {
    const product = await this.productRepo.getProduct(productId);
    return product;
  }

  public get productsWithSizes(): IProductWithSizes[] {
    return this.products.map(product => ({
      ...product,
      colors: product.colors.map(color => ({
        ...color,
        sizes: color.sizes.map(sizeId => this.sizes.get(sizeId)).filter(Boolean) as ISize[],
      }))
    }))
  }

  public get productImagesMap(): Map<number, string[]> {
    const imagesMap = new Map<number, string[]>();
    
    this.products.forEach(product => {
      imagesMap.set(product.id, product.colors.flatMap(color => color.images));
    });
    
    return imagesMap;
  }
}

export const productStore = new ProductStore();
