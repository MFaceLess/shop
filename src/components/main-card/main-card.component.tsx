import { PhotoCarousel } from '../photo-carousel/photo-carousel.component';
import styles from './main-card.component.module.css';

interface IMainProductCardProps {
  name: string;
  imagesUrl: string[];
}

export const MainProductCard = ({ name, imagesUrl }: IMainProductCardProps) => {
  return (
    <section className={styles.card}>
      <PhotoCarousel urls={imagesUrl} />
      <h5>{name}</h5>
    </section>
  )
}
