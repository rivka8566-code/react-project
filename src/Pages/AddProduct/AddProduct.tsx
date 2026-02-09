import type { FC } from 'react';
import styles from './AddProduct.module.scss';

interface AddProductProps {}

const AddProduct: FC<AddProductProps> = () => (
  <div className={styles.AddProduct}>
    AddProduct Component
  </div>
);

export default AddProduct;
