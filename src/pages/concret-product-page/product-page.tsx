import { Header, ProductCardComponent } from '../../components';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { IProduct, ISize } from '../../domain/types';
import { purchaseStore } from '../../state/purchase';
import { productRepository } from '../../data/repositories';
import styles from './product-page.module.css';
import { toast } from 'react-toastify';

export const ConcreteProductCardComponent = observer(() => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProduct>();
  const [selectedSizesByColor, setSelectedSizesByColor] = useState<Map<number, number[]>>(new Map());
  const [sizesMap, setSizesMap] = useState<Map<number, ISize>>(new Map());

  useEffect(() => {
    if (!id) {
      return;
    }

    productRepository.getProduct(Number(id))
      .then(setProduct)
  }, [id])

  useEffect(() => {
    if (!product) return;

    const sizeIDs = product.colors.flatMap(color => color.sizes);
    const promises: Promise<ISize>[] = [];
    sizeIDs.forEach(sizeID => {
      promises.push(productRepository.getSize(sizeID));
    })
    Promise.all(promises)
      .then(sizes => {
        const map = new Map(sizes.map(size => [size.id, size]));
        setSizesMap(map);
      });
  }, [product])

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
      toast.warning('Пожалуйста, выберите размеры.');
      return;
    }

    purchaseStore.buyItem(product, colorId, selectedSizes);

    setSelectedSizesByColor(prev => {
      const newMap = new Map(prev);
      newMap.delete(colorId)
      return newMap;
    });
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
            sizes={color.sizes.length === 0 
              ? undefined 
              : color.sizes
                .map(sizeId => sizesMap.get(sizeId))
              . filter((size): size is ISize => size !== undefined)
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
