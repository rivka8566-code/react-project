import { useEffect, useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AiOutlineCamera } from 'react-icons/ai';
import { createProduct } from '../../Services/api';
import { User } from '../../models/User';
import { Product } from '../../models/Product';
import styles from './AddProduct.module.scss';

interface AddProductProps {}

const AddProduct: FC<AddProductProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const navigate = useNavigate();

  const categories = ['סלון', 'חדר שינה', 'פינת אוכל', 'אחסון', 'אביזרים', 'חדר עבודה'];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('שדה חובה').min(3, 'שם המוצר חייב להיות לפחות 3 תווים'),
      description: Yup.string().required('שדה חובה').min(10, 'תיאור המוצר חייב להיות לפחות 10 תווים'),
      price: Yup.number().required('שדה חובה').positive('מחיר חייב להיות חיובי').max(100000, 'מחיר לא יכול להיות גבוה מ-100,000'),
      category: Yup.string().required('שדה חובה'),
      imageUrl: Yup.string().required('שדה חובה').url('כתובת URL לא תקינה')
    }),
    onSubmit: async (values) => {
      try {
        const newProduct: Omit<Product, 'id'> = {
          name: values.name,
          description: values.description,
          price: Number(values.price),
          category: values.category,
          imageUrl: values.imageUrl,
          salesCount: 0
        };
        await createProduct(newProduct);
        toast.success('המוצר נוסף בהצלחה');
        formik.resetForm();
        setImagePreview('');
        setTimeout(() => navigate('/home'), 1000);
      } catch (error) {
        toast.error('שגיאה בהוספת המוצר');
      }
    }
  });

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    formik.handleChange(e);
    setImagePreview(url);
  };

  if (!user) {
    return (
      <div className={styles.accessDenied}>
        <h1>אנא התחבר כדי לגשת לדף זה</h1>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className={styles.accessDenied}>
        <h1>אין לך הרשאה לגשת לדף זה</h1>
        <p>רק מנהלים יכולים להוסיף מוצרים</p>
      </div>
    );
  }

  return (
    <div className={styles.AddProduct}>
      <h1>הוספת מוצר חדש</h1>
      
      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.container}>
          <div className={styles.rightSection}>
            <div className={styles.field}>
              <label>שם המוצר</label>
              <input
                type="text"
                name="name"
                placeholder="שם המוצר"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className={styles.errorText}>{formik.errors.name}</div>
              )}
            </div>

            <div className={styles.field}>
              <label>תיאור המוצר</label>
              <textarea
                name="description"
                placeholder="תיאור מפורט של המוצר ..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={5}
              />
              {formik.touched.description && formik.errors.description && (
                <div className={styles.errorText}>{formik.errors.description}</div>
              )}
            </div>

            <div className={styles.field}>
              <label>מחיר (₪)</label>
              <input
                type="number"
                name="price"
                placeholder="0"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <div className={styles.errorText}>{formik.errors.price}</div>
              )}
            </div>

            <div className={styles.field}>
              <label>קטגוריה</label>
              <select
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">בחר קטגוריה</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && (
                <div className={styles.errorText}>{formik.errors.category}</div>
              )}
            </div>
          </div>

          <div className={styles.leftSection}>
            <div className={styles.field}>
              <label>תמונת המוצר</label>
              <div className={styles.imagePreview}>
                {imagePreview ? (
                  <img src={imagePreview} alt="תצוגה מקדימה" onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    setImagePreview('');
                  }} />
                ) : (
                  <div className={styles.placeholder}>
                    <AiOutlineCamera />
                    <p>הזן כתובת URL לתמונה</p>
                  </div>
                )}
              </div>
              <label>כתובת URL של התמונה</label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={formik.values.imageUrl}
                onChange={handleImageUrlChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.imageUrl && formik.errors.imageUrl && (
                <div className={styles.errorText}>{formik.errors.imageUrl}</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitBtn}>
            הוסף מוצר
          </button>
          <button type="button" className={styles.cancelBtn} onClick={() => navigate('/home')}>
            ביטול
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
