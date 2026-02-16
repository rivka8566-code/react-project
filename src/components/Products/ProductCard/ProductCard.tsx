import { useEffect, useState, type FC } from 'react';
import styles from './ProductCard.module.scss';
import type { Product } from '../../../models/Product';
import { getProductById } from '../../../Services/api';
import Spinner from '../../UI/Spinner/Spinner';

interface ProductCardProps {
  productId: number;
}

const ProductCard: FC<ProductCardProps> = (props: ProductCardProps) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(props.productId);
        setProduct(response);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    fetchProduct();
  }, [props.productId]);



  return (
  <div className={styles.ProductCard}>
    {product ? (
      <>
        <div className={styles.productInfo}>
          <h2 className={styles.productName}>{product.name}</h2>
          <p className={styles.productDescription}>{product.description}</p>
          <p className={styles.productPrice}>₪{product.price.toLocaleString()}</p>
        </div>
        <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
      </>
    ) : (
      <Spinner inline/>
    )}
  </div>
)};

export default ProductCard;
