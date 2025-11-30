import { useNavigate } from 'react-router-dom';
import styles from './store-header.component.module.css';

interface IHeaderProps {
  name: string;
}

export const Header = ({ name }: IHeaderProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  }

  const handlePurchaseClick = () => {
    navigate('/purchase');
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftItems}>
        <button 
          className={`${styles.icon} ${styles.noOutline}`}
          onClick={() => handleBackClick()}
        >
          <img src='/back.svg' />
        </button>
        <h5>{name}</h5>
      </div>
      <button 
        className={styles.icon}
        onClick={() => handlePurchaseClick()}  
      >
        <img src='/cart.svg' alt='Корзина'/>
      </button>
    </header>
  )
}
