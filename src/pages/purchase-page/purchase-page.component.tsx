import { observer } from 'mobx-react-lite';
import { Header, ProductCardComponent } from '../../components';
import { purchaseStore } from '../../state/purchase';
import { useEffect, useState } from 'react';
import { productRepository } from '../../data/repositories';
import type { ISize } from '../../domain/types';
import styles from './purchase-page.component.module.css';


export const PurchaseComponent = observer(() => {
  const purchasedItems = purchaseStore.myPurchase;
  const [selectedSizesMap, setSelectedSizesMap] = useState<Map<string, number[]>>(new Map());
  const [sizesMap, setSizesMap] = useState<Map<number, ISize>>(new Map());

  useEffect(() => {
    const sizeIDs = purchasedItems.flatMap(product => product.product.colors.flatMap(color => color.sizes));
    const promises: Promise<ISize>[] = [];
    sizeIDs.forEach(sizeID => {
      promises.push(productRepository.getSize(sizeID));
    })
    Promise.all(promises)
      .then(sizes => {
        const map = new Map(sizes.map(size => [size.id, size]));
        setSizesMap(map);
      });
  }, [purchasedItems])

  const handleSelectedSizesChange = (productId: number, colorId: number, selectedSizes: number[]) => {
    const key = `${productId}-${colorId}`;
    setSelectedSizesMap(prev => {
      const newMap = new Map(prev);
      newMap.set(key, selectedSizes);
      return newMap;
    });
  };

  if (purchasedItems.length === 0) {
    return (
      <>
        <Header name='Корзина'/>
        <main className={styles.emptyCart}>
          <div className={styles.emptyMessage}>
            <h2>Корзина пуста</h2>
            <img src='/shop/empty_state.png' alt='Empty State'/>
          </div>
        </main>
      </>
    )
  }

  const handleRemoveSizes = (productId: number, colorId: number) => {
    const key = `${productId}-${colorId}`;
    purchaseStore.removeSizes(productId, colorId, selectedSizesMap.get(`${productId}-${colorId}`)!)
    setSelectedSizesMap(prev => {
      const map = new Map(prev);
      map.delete(key);
      return map;
    })
  }

  return (
    <>
      <Header name='Корзина'/>
      <main className={styles.grid}>
        {purchasedItems.map((purchaseItem) => {
          const { product, color, selectedSizes } = purchaseItem;
          
          return (
            <ProductCardComponent
              key={`${product.id}-${color.id}`}
              name={product.name}
              imagesUrl={color.images}
              color={color.name}
              price={color.price}
              description={color.description}
              sizes={selectedSizes
                .map(sizeId => sizesMap.get(sizeId))
                .filter((size) => size !== undefined)
              }
              onSelectedSizesChange={(selectedSizes) => 
                handleSelectedSizesChange(product.id, color.id, selectedSizes)
              }
            >
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveSizes(product.id, color.id)}
                disabled={
                  selectedSizesMap.get(`${product.id}-${color.id}`) 
                    ? selectedSizesMap.get(`${product.id}-${color.id}`)?.length === 0 
                    : true
                }
              >
                Удалить выбранные размеры
              </button>
            </ProductCardComponent>
          )
        })}
      </main>
    </>
  )
})