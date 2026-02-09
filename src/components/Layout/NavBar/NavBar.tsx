import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser, AiOutlineLogout, AiOutlinePlus } from 'react-icons/ai';
import styles from './NavBar.module.scss';

const NavBar = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('חיפוש:', searchQuery);
  };

  return (
    <nav className={styles.NavBar}>
      <div className={styles.left}>
        {user ? (
          <>
            <button onClick={handleLogout} className={styles.textBtn}>
              התנתק
            </button>
            <Link to="/profile" className={styles.textBtn}>
              פרופיל
            </Link>
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

      <form className={styles.search} onSubmit={handleSearch}>
        <AiOutlineSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="חיפוש מוצרים..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className={styles.right}>
        <Link to="/" className={styles.homeIcon}><AiOutlineHome /></Link>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/assets/images/logos/logo.png" alt="Art Living" />
            <span>ArtLiving</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
