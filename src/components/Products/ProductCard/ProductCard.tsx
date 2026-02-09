import type { FC } from 'react';
import styles from './ProductCard.module.scss';

interface ProductCardProps {}

const ProductCard: FC<ProductCardProps> = () => (
  <div className={styles.ProductCard}>
    ProductCard Component
  </div>
);

export default ProductCard;
