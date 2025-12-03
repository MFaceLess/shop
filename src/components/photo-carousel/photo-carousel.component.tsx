import { useEffect, useState } from 'react';
import styles from './photo-carousel.component.module.css';

enum ClickDirection {
  left,
  right,
}

interface IPhotos {
  urls: string[];
}

export const PhotoCarousel = ({urls}: IPhotos) => {
  const [currentPhotoIndex, setPhotoIndex] = useState(0);
  
  useEffect(() => {
    requestIdleCallback(() => {
      urls.forEach(url => {
        const img = new Image();
        img.src = `/shop/${url}`;
      })
    })
  }, [urls])

  const handleClick = (direction: ClickDirection, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    switch (direction) {
      case ClickDirection.left:
        setPhotoIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case ClickDirection.right:
        setPhotoIndex(prev => prev < urls.length - 1 ? prev + 1 : prev);
        break;
    }
    event.stopPropagation();
    event.preventDefault();
  }

  return (
    <div className={styles.carouselContainer}>
      <img className={styles.photo} src={`/shop/${urls[currentPhotoIndex]}`} alt="photo" />
      <button 
        className={`${styles.navButton} ${styles.leftButton}`} 
        onClick={(event) => handleClick(ClickDirection.left, event)}
        disabled={currentPhotoIndex === 0}>
          <img className={styles.arrow} src={'/shop/left.svg'} />
      </button>
      <button 
        className={`${styles.navButton} ${styles.rightButton}`} 
        onClick={(event) => handleClick(ClickDirection.right, event)}
        disabled={currentPhotoIndex === urls.length - 1}>
        <img className={styles.arrow} src={'/shop/right.svg'} />
      </button>
    </div>
  )
}
