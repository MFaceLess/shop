import { Header, ProductCardComponent } from '../../components';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { productStore } from '../../state/store';
import type { IProduct, ISize } from '../../domain/types';
import styles from './product-page.module.css';
import { purchaseStore } from '../../state/purchase';

export const ConcreteProductCardComponent = observer(() => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [selectedSizesByColor, setSelectedSizesByColor] = useState<Map<number, number[]>>(new Map());

  const sizes = productStore.sizes;

  useEffect(() => {
    productStore.loadSizes();

    const concreteProduct = productStore.products.find(product => product.id === Number(id));
    if (concreteProduct) {
      setProduct(concreteProduct);
    } else {
      productStore.loadProduct(Number(id))
        .then(setProduct);
    }
  }, [id])

  const handleSelectedSizesChange = (colorId: number, selectedSizes: number[]) => {
    setSelectedSizesByColor(prev => {
      const newMap = new Map(prev);
      newMap.set(colorId, selectedSizes);
      return newMap;
    });
  };

  const handleBuyClick = (colorId: number) => {
    if (!product) return;

    const selectedSizes = selectedSizesByColor.get(colorId) || [];
    
    if (selectedSizes.length === 0) {
      alert('Пожалуйста, выберите размеры');
      return;
    }

    purchaseStore.buyItem(product, colorId, selectedSizes);
  }

  const getDisabledSizesForColor = (colorId: number): number[] => {
    if (!product) return [];
    
    const purchasesForThisProductAndColor = purchaseStore.myPurchase.filter(
      item => item.product.id === product.id && item.color.id === colorId
    );
    
    const disabledSizes: number[] = [];
    purchasesForThisProductAndColor.forEach(purchase => {
      disabledSizes.push(...purchase.selectedSizes);
    });
    
    return disabledSizes;
  };

  return (
    <>
      <Header name={product?.name ?? 'Главная'} />
      <main className={styles.grid}>
        {product?.colors.map(color => (
          <ProductCardComponent
            key={color.id} 
            name={product.name}
            imagesUrl={color.images}
            color={color.name}
            price={color.price}
            description={color.description}
            sizes={color.sizes
              .map(sizeId => sizes.get(sizeId))
              .filter((size): size is ISize => size !== undefined)
            }
            onSelectedSizesChange={(selectedSizes) => 
              handleSelectedSizesChange(color.id, selectedSizes)
            }
            disabledSizes={getDisabledSizesForColor(color.id)}
          >
            {color.sizes.length > 0 &&
              <button 
                className={styles.buyButton}
                onClick={() => handleBuyClick(color.id)}
              >
                Добавить в корзину
              </button>
            }
          </ProductCardComponent>
        ))}
      </main>
    </>
  )
})