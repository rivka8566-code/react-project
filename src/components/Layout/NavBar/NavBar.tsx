import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser, AiOutlineLogout, AiOutlinePlus } from 'react-icons/ai';
import styles from './NavBar.module.scss';
import type { Product } from '../../../models/Product';
import { getProductsByName } from '../../../Services/api';

const NavBar = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  }, [location.key]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() !== '') {
        try {
          const data = await getProductsByName(searchQuery);
          setSearchResults(data);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching products:", error);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={styles.NavBar}>
      <div className={styles.left}>
        {user ? (
          <>
            <button onClick={handleLogout} className={styles.textBtn}>
              <AiOutlineLogout className={styles.logoutIcon} />
            </button>
            <Link to="/profile" className={styles.textBtn}>
             <AiOutlineUser className={styles.userIcon} />
            </Link>
            <span className={styles.welcome} >שלום, {user.firstName}</span>
            {user.isAdmin && (
              <Link to="/add-product" className={styles.addProductBtn}>
                <AiOutlinePlus /> הוסף מוצר
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/sign-up">הרשמה</Link>
            <Link to="/login">התחברות</Link>
          </>
        )}
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.search}>
          <AiOutlineSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="חיפוש מוצרים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {showResults && searchResults.length > 0 && (
          <div className={styles.searchResults}>
            {searchResults.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={styles.resultItem}
                onClick={() => {
                  setShowResults(false);
                  setSearchQuery('');
                }}
              >
                <img src={product.imageUrl} alt={product.name} />
                <div className={styles.resultInfo}>
                  <span className={styles.resultName}>{product.name}</span>
                  <span className={styles.resultPrice}>₪{product.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {showResults && searchResults.length === 0 && (
          <div className={styles.searchResults}>
            <div className={styles.noResults}>לא נמצאו תוצאות</div>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <Link to="/home" className={styles.homeIcon} onClick={() => {
          setSearchQuery('');
          setSearchResults([]);
          setShowResults(false);
        }}><AiOutlineHome /></Link>
        <div className={styles.logo}>
          <Link to="/home" onClick={() => {
            setSearchQuery('');
            setSearchResults([]);
            setShowResults(false);
          }}>
            <img src="/assets/images/logos/logo.png" alt="Art Living" />
            <span>ArtLiving</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
