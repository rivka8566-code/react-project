import type { FC } from 'react';
import styles from './ProductDetails.module.scss';

interface ProductDetailsProps {}

const ProductDetails: FC<ProductDetailsProps> = () => (
  <div className={styles.ProductDetails}>
    ProductDetails Component
  </div>
);

export default ProductDetails;
