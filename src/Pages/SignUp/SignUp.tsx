import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser, AiOutlinePhone, AiOutlineHome } from 'react-icons/ai';
import { signUp, api } from '../../Services/api';
import { User } from '../../models/User';
import styles from './SignUp.module.scss';

const cities = [
  'ירושלים',
  'תל אביב',
  'חיפה',
  'ראשון לציון',
  'פתח תקווה',
  'אשדוד',
  'נתניה',
  'באר שבע',
  'בני ברק',
  'חולון',
  'רמת גן',
  'אשקלון',
  'רחובות',
  'בת ים',
];

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('שדה חובה'),
      lastName: Yup.string().required('שדה חובה'),
      email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
      phone: Yup.string().required('שדה חובה'),
      city: Yup.string().required('שדה חובה'),
      password: Yup.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים').required('שדה חובה'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'הסיסמאות לא תואמות')
        .required('שדה חובה'),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        const response = await api.get(`/users?email=${values.email}`);
        const existingUsers = response.data;
        
        if (existingUsers.length > 0) {
          setFieldError('email', 'אימייל זה כבר קיים במערכת');
          return;
        }

        const userData: Omit<User, 'id'> = {
          firstName: values.firstName,
          lastName: values.lastName,
          userName: values.email.split('@')[0],
          email: values.email,
          phone: values.phone,
          password: values.password,
          address: {
            street: '',
            city: values.city,
            state: 'Israel',
            zip: '0000000',
          },
          isAdmin: false,
        };
        
        await signUp(userData);
        toast.success('הרשמה הצליחה! מעביר להתחברות...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } catch (err) {
        toast.error('שגיאה בהרשמה');
      }
    }
  });

  return (
    <div className={styles.SignUp}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>A</div>
          <h1>ArtLiving</h1>
          <p>צור חשבון חדש</p>
        </div>

        <div className={styles.tabs}>
          <button type="button" onClick={() => navigate('/login')}>
            התחברות
          </button>
          <button type="button" className={styles.active}>
            הרשמה
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>שם פרטי</label>
              <div className={styles.inputWrapper}>
                <input
                  name="firstName"
                  placeholder="שם פרטי"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.firstName && formik.touched.firstName
                      ? styles.error
                      : !formik.errors.firstName && formik.touched.firstName && formik.values.firstName
                      ? styles.success
                      : ''
                  }
                />
                <AiOutlineUser className={styles.icon} />
              </div>
              {formik.touched.firstName && formik.errors.firstName && (
                <div className={styles.errorText}>{formik.errors.firstName}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>שם משפחה</label>
              <div className={styles.inputWrapper}>
                <input
                  name="lastName"
                  placeholder="שם משפחה"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={
                    formik.errors.lastName && formik.touched.lastName
                      ? styles.error
                      : !formik.errors.lastName && formik.touched.lastName && formik.values.lastName
                      ? styles.success
                      : ''
                  }
                />
                <AiOutlineUser className={styles.icon} />
              </div>
              {formik.touched.lastName && formik.errors.lastName && (
                <div className={styles.errorText}>{formik.errors.lastName}</div>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>אימייל</label>
            <div className={styles.inputWrapper}>
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.email && formik.touched.email
                    ? styles.error
                    : !formik.errors.email && formik.touched.email && formik.values.email
                    ? styles.success
                    : ''
                }
              />
              <AiOutlineMail className={styles.icon} />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className={styles.errorText}>{formik.errors.email}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>טלפון</label>
            <div className={styles.inputWrapper}>
              <input
                name="phone"
                placeholder="050-1234567"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.phone && formik.touched.phone
                    ? styles.error
                    : !formik.errors.phone && formik.touched.phone && formik.values.phone
                    ? styles.success
                    : ''
                }
              />
              <AiOutlinePhone className={styles.icon} />
            </div>
            {formik.touched.phone && formik.errors.phone && (
              <div className={styles.errorText}>{formik.errors.phone}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>עיר</label>
            <div className={styles.inputWrapper}>
              <select
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.city && formik.touched.city
                    ? styles.error
                    : !formik.errors.city && formik.touched.city && formik.values.city
                    ? styles.success
                    : ''
                }
              >
                <option value="">בחר עיר</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <AiOutlineHome className={styles.icon} />
            </div>
            {formik.touched.city && formik.errors.city && (
              <div className={styles.errorText}>{formik.errors.city}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>סיסמה</label>
            <div className={styles.inputWrapper}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.password && formik.touched.password
                    ? styles.error
                    : !formik.errors.password && formik.touched.password && formik.values.password
                    ? styles.success
                    : ''
                }
              />
              <AiOutlineLock className={styles.icon} />
              <button type="button" className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
            <div className={styles.passwordHint}>8 תווים, אות גדולה וקטנה, מספר ותו מיוחד</div>
            {formik.touched.password && formik.errors.password && (
              <div className={styles.errorText}>{formik.errors.password}</div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>אימות סיסמה</label>
            <div className={styles.inputWrapper}>
              <input
                name="confirmPassword"
                type="password"
                placeholder="הקש שוב את הסיסמה"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.errors.confirmPassword && formik.touched.confirmPassword
                    ? styles.error
                    : !formik.errors.confirmPassword && formik.touched.confirmPassword && formik.values.confirmPassword
                    ? styles.success
                    : ''
                }
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className={styles.errorText}>{formik.errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            הירשם
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
