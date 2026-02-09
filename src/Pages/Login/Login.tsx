import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { login } from '../../Services/api';
import styles from './Login.module.scss';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('אימייל לא תקין')
    .required('שדה חובה'),
  password: Yup.string()
    .min(6, 'סיסמה חייבת להכיל לפחות 6 תווים')
    .required('שדה חובה'),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  return (
    <div className={styles.Login}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>A</div>
          <h1>ArtLiving</h1>
          <p>ריהוט ויופי לבית שלך</p>
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={activeTab === 'login' ? styles.active : ''}
            onClick={() => setActiveTab('login')}
          >
            התחברות
          </button>
          <button
            type="button"
            className={activeTab === 'signup' ? styles.active : ''}
            onClick={() => navigate('/sign-up')}
          >
            הרשמה
          </button>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setFieldError }) => {
            try {
              const user = await login(values.email, values.password);
              localStorage.setItem('user', JSON.stringify(user));
              toast.success(`שלום ${user.firstName}! התחברת בהצלחה`);
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            } catch (err) {
              setFieldError('password', 'אימייל או סיסמה שגויים');
            }
          }}
        >
          {({ errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.inputGroup}>
                <label>אימייל</label>
                <div className={styles.inputWrapper}>
                  <Field
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    className={errors.email && touched.email ? styles.error : ''}
                  />
                  <AiOutlineMail className={styles.icon} />
                </div>
                {errors.email && touched.email && (
                  <div className={styles.errorText}>{errors.email}</div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label>סיסמה</label>
                <div className={styles.inputWrapper}>
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={errors.password && touched.password ? styles.error : ''}
                  />
                  <AiOutlineLock className={styles.icon} />
                  <button
                    type="button"
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div className={styles.errorText}>{errors.password}</div>
                )}
              </div>

              <button type="submit" className={styles.submitBtn}>
                התחבר
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
