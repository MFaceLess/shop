import { useEffect } from 'react';
import { Header, ProductCardComponent } from '../../components';
import { observer } from 'mobx-react-lite';
import { productStore } from '../../state/store';
import { Link } from 'react-router-dom';
import styles from './products-page.module.css';

export const ProductsPageComponent = observer(() => {
  useEffect(() => {
    productStore.fetchProducts();
  }, [])

  const productImages = productStore.productImagesMap;

  return (
    <>
      <Header name='Главная'/>
      <main className={styles.grid}>
        {productStore.products.map(product => (
          <Link to={`${product.id}`} key={product.id} className={styles.link}>
            <ProductCardComponent  
              name={product.name} 
              imagesUrl={productImages.get(product.id) ?? []} />
          </Link>
        ))}
      </main>
    </>
  );
})