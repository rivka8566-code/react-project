import { useEffect, useState, type FC } from 'react';
import styles from './ProductDetails.module.scss';
import { useParams, Link } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { getProductById, getReviewsByProductId } from '../../Services/api';
import { Product } from '../../models/Product';
import { Review } from '../../models/Review';
import { User } from '../../models/User';
import ReviewList from '../../components/Reviews/ReviewList/ReviewList';
import AddReviewForm from '../../components/Reviews/AddReviewForm/AddReviewForm';
import Spinner from '../../components/UI/Spinner/Spinner';

interface ProductDetailsProps {}

const ProductDetails: FC<ProductDetailsProps> = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [showAddReview, setShowAddReview] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProductById(Number(id));
        setProduct(productData);
        
        const reviewsData = await getReviewsByProductId(Number(id));
        setReviews(reviewsData);
        
        if (reviewsData.length > 0) {
          const avg = reviewsData.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviewsData.length;
          setAvgRating(avg);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  if (!product) return <Spinner />;

  return (
    <div className={styles.ProductDetails}>
      <div className={styles.breadcrumb}>
        <Link to="/home">חזרה</Link>
      </div>

      <div className={styles.productSection}>
        <img src={product.imageUrl} alt={product.name} className={styles.productImage} />
        <div className={styles.productInfo}>
          <span className={styles.category}>פינת אוכל</span>
          {product.salesCount >= 50 && (
            <span className={styles.bestSellerBadge}>רב מכר</span>
          )}
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.productDescription}>{product.description}</p>
          <div className={styles.priceSection}>
            <span className={styles.price}>₪{product.price.toLocaleString()}</span>
            <span className={styles.divider}>|</span>
            <span className={styles.salesCount}>{product.salesCount} נמכרו</span>
          </div>
          <div className={styles.ratingSection}>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <AiFillStar key={star} className={star <= avgRating ? styles.starFilled : styles.starEmpty} />
              ))}
            </div>
            <span className={styles.reviewCount}>({reviews.length} חוות דעת)</span>
          </div>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2>חוות דעת ({reviews.length})</h2>
          {user && !user.isAdmin && !showAddReview && (
            <button className={styles.addReviewBtn} onClick={() => setShowAddReview(true)}>הוסף חוות דעת</button>
          )}
        </div>
        {user && !user.isAdmin && showAddReview && (
          <AddReviewForm 
            productId={Number(id)} 
            userId={user.id} 
            userName={user.userName} 
            onCancel={() => setShowAddReview(false)}
          />
        )}
        <ReviewList idProduct={Number(id)} idUser={user?.id || 0} isAdmin={user?.isAdmin || false} />
      </div>
    </div>
  );
}

export default ProductDetails;
