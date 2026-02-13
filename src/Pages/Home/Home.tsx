import { useEffect, useState, type FC } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Home.module.scss';
import ProductGrid from '../../components/Products/ProductGrid/ProductGrid';
import type { Product } from '../../models/Product';
import { getProducts, getProductsByCategory } from '../../Services/api';
import Spinner from '../../components/UI/Spinner/Spinner';

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('הכל');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const location = useLocation();

  const categories = ['הכל', 'סלון', 'חדר שינה', 'פינת אוכל', 'אחסון', 'אביזרים', 'חדר עבודה'];

  useEffect(() => {
    setSelectedCategory('הכל');
    setPage(1);
    setHasMore(true);
  }, [location.key]);

  useEffect(() => {

    const fetchProducts = async () => {
      setIsLoading(true);
      setProducts([]);
      setPage(1);
      setHasMore(true);
      try {
        const [data] = await Promise.all([
          selectedCategory === 'הכל' 
            ? getProducts(1) 
            : getProductsByCategory(selectedCategory, 1),
          new Promise(resolve => setTimeout(resolve, 500))
        ]);
        setProducts(data);
        setHasMore(data.length === 20);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory, setIsLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return;
      
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        if (hasMore && !isLoading) {
          loadMoreProducts();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, isLoading, page, selectedCategory]);

  const loadMoreProducts = async () => {
    setIsLoadingMore(true);
    
    const startTime = Date.now();
    
    try {
      const nextPage = page + 1;
      const data = selectedCategory === 'הכל' 
        ? await getProducts(nextPage) 
        : await getProductsByCategory(selectedCategory, nextPage);
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = 700 - elapsedTime;
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      if (data.length > 0) {
        setProducts(prev => [...prev, ...data]);
        setPage(nextPage);
        setHasMore(data.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className={styles.homeContainer} style={{ minHeight: isLoadingMore ? '100vh' : 'auto' }}>
      <div className={styles.hero}>
        <h1>ArtLiving – להפוך כל חלל ליצירת אמנות.</h1>
        <h1>ריהוט יוקרתי לבית שלך</h1>
        <p>גלה את הקולקציה שלנו של ריהוט מעוצבים באיכות גבוהה,<br /> שמפגישים סטייל ונוחות לכל חדר</p>
      </div>

      <div className={styles.categories}>
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? styles.active : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className={styles.productsGrid}>
        {isLoading ? (
          <div className={styles.spinnerContainer}>
            <Spinner inline />
          </div>
        ) : (
          products.map((product, index) => (
            <div key={product.id} className={index < 20 ? styles.productItem : ''} style={index < 20 ? { animationDelay: `${index * 0.05}s` } : {}}>
              <ProductGrid id={product.id} />
            </div>
          ))
        )}
      </div>
      {isLoadingMore && (
        <div className={styles.loadMoreSpinner}>
          <Spinner inline />
        </div>
      )}
      {!isLoading && !isLoadingMore && !hasMore && products.length > 0 && (
        <div className={styles.endMessage}>
          בינתיים אין עוד מוצרים להציג :)
        </div>
      )}
    </div>
  );
};

export default Home;
