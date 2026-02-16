import { useEffect, useState, type FC } from 'react';
import styles from './ProductGrid.module.scss';
import { Product } from '../../../models/Product';
import { getProductById, deleteProduct } from '../../../Services/api';
import { Link } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';

interface ProductGridProps {
  id: number;
}

const ProductGrid: FC<ProductGridProps> = (props: ProductGridProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try{
        const data = await getProductById(props.id);
        setProduct(data);
      }
      catch(error){
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [props.id]);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteProduct(props.id.toString());
      toast.success('המוצר נמחק בהצלחה');
      window.location.reload();
    } catch (error) {
      toast.error('שגיאה במחיקת המוצר');
    }
  };


  return (
    <div className={styles.ProductGrid}>
      {product && (
        <div className={styles.productCard}>
          {user?.isAdmin && (
            <button className={styles.deleteButton} onClick={() => setShowDeleteModal(true)}>
              <AiOutlineDelete />
            </button>
          )}
          <div className={styles.imageWrapper}>
            {product.salesCount > 50 && (
              <span className={styles.bestSeller}>רב מכר</span>
            )}
            <img 
              src={product.imageUrl} 
              alt=""
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x280?text=No+Image';
              }}
            />
          </div>
          <div className={styles.productInfo}>
            <h3 className={styles.productName}>{product.name}</h3>
            <div className={styles.productDetails}>
              <span className={styles.sold}>נמכרו {product.salesCount}</span>
              <span className={styles.price}>₪{product.price.toLocaleString()}</span>
            </div>
            <Link to={`/product/${product.id}`} className={styles.viewButton}>צפה בפרטים</Link>
          </div>
        </div>
      )}
      
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>מחיקת מוצר</h2>
            <p>האם אתה בטוח שברצונך למחוק את המוצר?</p>
            <div className={styles.modalButtons}>
              <button className={styles.cancelBtn} onClick={() => setShowDeleteModal(false)}>ביטול</button>
              <button className={styles.confirmBtn} onClick={handleDelete}>מחק</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
