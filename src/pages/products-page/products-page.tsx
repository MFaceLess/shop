import { useEffect, useMemo, useState } from 'react';
import { Header, MainProductCard } from '../../components';
import { Link } from 'react-router-dom';
import type { IProduct } from '../../domain/types';
import { productRepository } from '../../data/repositories';
import styles from './products-page.module.css';

export const ProductsPageComponent = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const productImagesMap = useMemo(() => {
    const map = new Map<number, string[]>();
    products.forEach(product => {
      map.set(product.id, product.colors.flatMap(color => color.images));
    })
    return map;
  }, [products])

  useEffect(() => {
    productRepository.getProducts()
      .then(setProducts);
  }, [])

  return (
    <>
      <Header name='Главная'/>
      <main className={styles.grid}>
        {products.map(product => (
          <Link to={`${product.id}`} key={product.id} className={styles.link}>
            <MainProductCard
              name={product.name} 
              imagesUrl={productImagesMap.get(product.id) ?? []} />
          </Link>
        ))}
      </main>
    </>
  );
}
