import type { FC } from 'react';
import styles from './ProductGrid.module.scss';

interface ProductGridProps {}

const ProductGrid: FC<ProductGridProps> = () => (
  <div className={styles.ProductGrid}>
    ProductGrid Component
  </div>
);

export default ProductGrid;
