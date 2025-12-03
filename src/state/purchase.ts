import { makeAutoObservable } from "mobx";
import type { IColor, IProduct } from '../domain/types';

const NOT_EXIST = -1;

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

    const existingIndex = this.myPurchase.findIndex(
      item => item.product.id === product.id && item.color.id === colorId
    );

    if (existingIndex === NOT_EXIST) {
      this.myPurchase.push({
        product,
        color,
        selectedSizes
      });
    } else {
      const existingItem = this.myPurchase[existingIndex];    
      const combinedSizes = [...new Set([
        ...existingItem.selectedSizes,
        ...selectedSizes
      ])];
      this.myPurchase[existingIndex] = {
        ...existingItem,
        selectedSizes: combinedSizes
      };
    }


    this.saveToLocalStorage();
  }

  public removeItem(productId: number, colorId: number) {
    this.myPurchase = this.myPurchase.filter(
      item => !(item.product.id === productId && item.color.id === colorId)
    );
    this.saveToLocalStorage();
  }

  public removeSizes(productId: number, colorId: number, sizesToRemove: number[]) {
    if (sizesToRemove.length === 0) {
      this.removeItem(productId, colorId);
      return;
    }

    this.myPurchase = this.myPurchase.map(item => {
      if (item.product.id === productId && item.color.id === colorId) {
        const remainingSizes = item.selectedSizes.filter(
          sizeId => !sizesToRemove.includes(sizeId)
        );
        
        if (remainingSizes.length > 0) {
          return {
            ...item,
            selectedSizes: remainingSizes
          };
        } else {
          return null;
        }
      }
      return item;
    })
      .filter((item): item is { product: IProduct; color: IColor; selectedSizes: number[] } => 
        item !== null
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
