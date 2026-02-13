import type { FC } from 'react';
import styles from './ProductDetails.module.scss';
import { useParams } from 'react-router-dom';

interface ProductDetailsProps {
}

const ProductDetails: FC<ProductDetailsProps> = () => {
  return (
    <div className={styles.ProductDetails}>
      <h1>פרטי מוצר</h1>
      <p>ID:{useParams().id}</p>
    </div>
  );
}

export default ProductDetails;
