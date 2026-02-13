import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
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

const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required('שדה חובה'),
  lastName: Yup.string().required('שדה חובה'),
  email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
  phone: Yup.string().required('שדה חובה'),
  city: Yup.string().required('שדה חובה'),
  password: Yup.string().min(8, 'סיסמה חייבת להכיל לפחות 8 תווים').required('שדה חובה'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'הסיסמאות לא תואמות')
    .required('שדה חובה'),
});

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            city: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={signUpSchema}
          onSubmit={async (values, { setFieldError }) => {
            try {
              // בדיקה אם האימייל כבר קיים
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
          }}
        >
          {({ errors, touched, values }) => (
            <Form className={styles.form}>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>שם פרטי</label>
                  <div className={styles.inputWrapper}>
                    <Field 
                      name="firstName" 
                      placeholder="שם פרטי" 
                      className={
                        errors.firstName && touched.firstName 
                          ? styles.error 
                          : !errors.firstName && touched.firstName && values.firstName
                          ? styles.success
                          : ''
                      } 
                    />
                    <AiOutlineUser className={styles.icon} />
                  </div>
                  {errors.firstName && touched.firstName && <div className={styles.errorText}>{errors.firstName}</div>}
                </div>

                <div className={styles.inputGroup}>
                  <label>שם משפחה</label>
                  <div className={styles.inputWrapper}>
                    <Field 
                      name="lastName" 
                      placeholder="שם משפחה" 
                      className={
                        errors.lastName && touched.lastName 
                          ? styles.error 
                          : !errors.lastName && touched.lastName && values.lastName
                          ? styles.success
                          : ''
                      } 
                    />
                    <AiOutlineUser className={styles.icon} />
                  </div>
                  {errors.lastName && touched.lastName && <div className={styles.errorText}>{errors.lastName}</div>}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>אימייל</label>
                <div className={styles.inputWrapper}>
                  <Field 
                    name="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className={
                      errors.email && touched.email 
                        ? styles.error 
                        : !errors.email && touched.email && values.email
                        ? styles.success
                        : ''
                    } 
                  />
                  <AiOutlineMail className={styles.icon} />
                </div>
                {errors.email && touched.email && <div className={styles.errorText}>{errors.email}</div>}
              </div>

              <div className={styles.inputGroup}>
                <label>טלפון</label>
                <div className={styles.inputWrapper}>
                  <Field 
                    name="phone" 
                    placeholder="050-1234567" 
                    className={
                      errors.phone && touched.phone 
                        ? styles.error 
                        : !errors.phone && touched.phone && values.phone
                        ? styles.success
                        : ''
                    } 
                  />
                  <AiOutlinePhone className={styles.icon} />
                </div>
                {errors.phone && touched.phone && <div className={styles.errorText}>{errors.phone}</div>}
              </div>

              <div className={styles.inputGroup}>
                <label>עיר</label>
                <div className={styles.inputWrapper}>
                  <Field 
                    as="select" 
                    name="city" 
                    className={
                      errors.city && touched.city 
                        ? styles.error 
                        : !errors.city && touched.city && values.city
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
                  </Field>
                  <AiOutlineHome className={styles.icon} />
                </div>
                {errors.city && touched.city && <div className={styles.errorText}>{errors.city}</div>}
              </div>

              <div className={styles.inputGroup}>
                <label>סיסמה</label>
                <div className={styles.inputWrapper}>
                  <Field 
                    name="password" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    className={
                      errors.password && touched.password 
                        ? styles.error 
                        : !errors.password && touched.password && values.password
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
                {errors.password && touched.password && <div className={styles.errorText}>{errors.password}</div>}
              </div>

              <div className={styles.inputGroup}>
                <label>אימות סיסמה</label>
                <div className={styles.inputWrapper}>
                  <Field 
                    name="confirmPassword" 
                    type = "password"
                    placeholder="הקש שוב את הסיסמה" 
                    className={
                      errors.confirmPassword && touched.confirmPassword 
                        ? styles.error 
                        : !errors.confirmPassword && touched.confirmPassword && values.confirmPassword
                        ? styles.success
                        : ''
                    } 
                  />
                </div>
                {errors.confirmPassword && touched.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
              </div>

              <button type="submit" className={styles.submitBtn}>
                הירשם
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
