import { PhotoCarousel } from '../photo-carousel/photo-carousel.component';
import styles from './product-card.component.module.css';
import type { ISize } from '../../domain/types';
import { useMemo, useState, type ReactNode } from 'react';
import { SkeletonComponent } from '../skeleton/skeleton.component';

interface ProductCardProps {
  name: string;
  imagesUrl: string[];
  color?: string;
  price?: string;
  description?: string;
  sizes?: ISize[];
  children?: ReactNode;
  onSelectedSizesChange?: (selectedSizes: number[]) => void;
  disabledSizes?: number[];
}

export const ProductCardComponent = ({
  name, 
  imagesUrl, 
  color, 
  price, 
  description, 
  sizes, 
  children,
  onSelectedSizesChange,
  disabledSizes = [],
}: ProductCardProps) => {
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  const filteredSelectedSizes = useMemo(() => {
    return selectedSizes.filter(size => !disabledSizes.includes(size));
  }, [selectedSizes, disabledSizes]);

  const handleSizeChange = (sizeId: number, checked: boolean) => {
    if (disabledSizes.includes(sizeId)) return;

    let newSelectedSizes;
    
    if (checked) {
      newSelectedSizes = [...selectedSizes, sizeId];
    } else {
      newSelectedSizes = selectedSizes.filter(id => id !== sizeId);
    }
    
    setSelectedSizes(newSelectedSizes);
    onSelectedSizesChange?.(newSelectedSizes);
  };

  return (
    <section className={styles.card}>
      <PhotoCarousel urls={imagesUrl} />
      <h5>{name}</h5>
      <div className={styles.description}>
        {color && 
          <p>Цвет: {color}</p>
        }
        {description && 
          <p>Описание: {description}</p>
        }
        {price &&
          <p>Цена: {price}</p>
        }
        {sizes && sizes.length > 0 && (
          <div className={styles.sizesContainer}>
            <p>Размеры:</p>
            <div className={styles.sizesGrid}>
              {sizes.map(size => {
                const isDisabled = disabledSizes.includes(size.id);
                const isSelected = filteredSelectedSizes.includes(size.id);
                
                return (
                  <label 
                    key={size.id} 
                    className={`${styles.sizeOption} ${isDisabled ? styles.disabled : ''}`}
                  >
                    <input 
                      type="checkbox" 
                      value={size.id}
                      onChange={(e) => handleSizeChange(size.id, e.target.checked)}
                      checked={isSelected}
                      disabled={isDisabled}
                      className={styles.hiddenCheckbox}
                    />
                    <span className={`${styles.sizeButton} ${isDisabled ? styles.disabledSize : ''}`}>
                      {size.label} ({size.number})
                      {isDisabled && <span className={styles.soldOutBadge}>✓</span>}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        {sizes?.length === 0 && <SkeletonComponent height={126}/>}
        {children &&
          children
        }
      </div>   
    </section>
  )
}
