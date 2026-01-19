import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

const Home = () => {
  // הגדרת הסטייט עם מערך ריק. אם את ב-TypeScript, זה פותר את ה"אדום"
const [products, setProducts] = useState<Product[]>([]);  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("שגיאה בטעינת הנתונים:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>טוען מוצרים...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>גלריית ArtLiving</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {products && products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '10px' }}>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }}
                // בדיקה אם התמונה קיימת - אם לא, מציג תמונה חלופית
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/200"; }}
              />
              <h3 style={{ fontSize: '16px', margin: '10px 0' }}>{product.name}</h3>
              <p style={{ color: '#888' }}>₪{product.price}</p>
            </div>
          ))
        ) : (
          <p>לא נמצאו מוצרים להצגה.</p>
        )}
      </div>
    </div>
  );
};

export default Home;