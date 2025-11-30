import { makeAutoObservable } from "mobx";
import type { IColor, IProduct } from '../domain/types';

export class PurchaseStore {
  public myPurchase: Array<{
    product: IProduct;
    color: IColor;
    selectedSizes: number[];
  }> = [];
  
  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage()
  }

  public buyItem(product: IProduct, colorId: number, selectedSizes: number[]) {
    const color = product.colors.find(c => c.id === colorId);
    if (!color) return;

    this.myPurchase.push({
      product,
      color,
      selectedSizes
    });

    this.saveToLocalStorage();
  }

  public removeItem(productId: number, colorId: number) {
    this.myPurchase = this.myPurchase.filter(
      item => !(item.product.id === productId && item.color.id === colorId)
    );
    this.saveToLocalStorage();
  }

  public get totalItems() {
    return this.myPurchase.length;
  }

  public getPurchaseByProductAndColor(productId: number, colorId: number) {
    return this.myPurchase.find(
      item => item.product.id === productId && item.color.id === colorId
    );
  }

  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      const saved = localStorage.getItem('purchaseStore_myPurchase');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.myPurchase = parsed;
      }
    } catch (error) {
      console.error('Error loading purchases from localStorage:', error);
      this.myPurchase = [];
    }
  }

  private saveToLocalStorage() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem('purchaseStore_myPurchase', JSON.stringify(this.myPurchase));
    } catch (error) {
      console.error('Error saving purchases to localStorage:', error);
    }
  }
}

export const purchaseStore = new PurchaseStore();
