import { observer } from 'mobx-react-lite';
import { Header, ProductCardComponent } from '../../components';
import { productStore } from '../../state/store';
import { purchaseStore } from '../../state/purchase';
import styles from './purchase-page.component.module.css';
import { useEffect } from 'react';


export const PurchaseComponent = observer(() => {
  const purchasedItems = purchaseStore.myPurchase;

  useEffect(() => {
    productStore.loadSizes();
  }, [])

  if (purchasedItems.length === 0) {
    return (
      <>
        <Header name='Корзина'/>
        <main className={styles.emptyCart}>
          <div className={styles.emptyMessage}>
            <h2>Корзина пуста</h2>
            <p>Добавьте товары из каталога</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header name='Корзина'/>
      <main className={styles.grid}>
        {purchasedItems.map((purchaseItem, index) => {
          const { product, color, selectedSizes } = purchaseItem;
          
          return (
            <ProductCardComponent
              key={`${product.id}-${color.id}-${index}`}
              name={product.name}
              imagesUrl={color.images}
              color={color.name}
              price={color.price}
              description={color.description}
              sizes={selectedSizes
                .map(sizeId => productStore.sizes.get(sizeId))
                .filter((size) => size !== undefined)
              }
              disabledSizes={selectedSizes}
            >
              <div className={styles.purchaseActions}>
                <button 
                  className={styles.removeButton}
                  onClick={() => purchaseStore.removeItem(product.id, color.id)}
                >
                  Удалить
                </button>
              </div>
            </ProductCardComponent>
          )
        })}
      </main>
    </>
  )
})