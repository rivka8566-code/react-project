import { useEffect, useState, type FC } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineMail, AiOutlineUser, AiOutlinePhone, AiOutlineEnvironment, AiOutlineEdit, AiOutlineSave, AiOutlineClose } from 'react-icons/ai';
import { updateUserProfile } from '../../Services/api';
import styles from './Profile.module.scss';
import Spinner from '../../components/UI/Spinner/Spinner';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
}

interface ProfileProps {}

const Profile: FC<ProfileProps> = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      zipCode: user?.address?.zip || ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      firstName: Yup.string().required('שדה חובה'),
      lastName: Yup.string().required('שדה חובה'),
      email: Yup.string().email('אימייל לא תקין').required('שדה חובה'),
      phone: Yup.string().matches(/^05\d{8}$/, 'מספר טלפון לא תקין').required('שדה חובה'),
      street: Yup.string(),
      city: Yup.string(),
      zipCode: Yup.string().matches(/^\d{7}$/, 'מיקוד חייב להכיל 7 ספרות')
    }),
    onSubmit: async (values) => {
      try {
        const updatedUser = { 
          ...user, 
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: {
            ...user.address,
            street: values.street,
            city: values.city,
            zip: values.zipCode
          }
        };
        await updateUserProfile(user.id, updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        toast.success('הפרטים נשמרו בהצלחה');
      } catch (error) {
        toast.error('שגיאה בשמירת הפרטים');
      }
    }
  });

  if (loading) return <div><Spinner inline/></div>;
  if (!user) return <div className={styles.noUser}><p>אנא התחבר כדי לצפות בפרופיל</p></div>;

  return (
    <div className={styles.Profile}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span>{user.firstName.charAt(0)}</span>
        </div>
        <div className={styles.headerText}>
          <h1>{user.firstName} {user.lastName}</h1>
          <span className={styles.role}>{user.isAdmin ? 'מנהל' : 'לקוח'}</span>
        </div>
        {!isEditing && (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            <AiOutlineEdit /> ערוך פרופיל
          </button>
        )}
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>אימייל</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!isEditing}
            />
            <AiOutlineMail className={styles.icon} />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className={styles.errorText}>{formik.errors.email}</div>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>שם פרטי</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!isEditing}
              />
              <AiOutlineUser className={styles.icon} />
            </div>
            {formik.touched.firstName && formik.errors.firstName && (
              <div className={styles.errorText}>{formik.errors.firstName}</div>
            )}
          </div>
          <div className={styles.field}>
            <label>שם משפחה</label>
            <input
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!isEditing}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className={styles.errorText}>{formik.errors.lastName}</div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label>טלפון</label>
          <div className={styles.inputWrapper}>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!isEditing}
            />
            <AiOutlinePhone className={styles.icon} />
          </div>
          {formik.touched.phone && formik.errors.phone && (
            <div className={styles.errorText}>{formik.errors.phone}</div>
          )}
        </div>

        <div className={styles.field}>
          <label>רחוב</label>
          <input
            type="text"
            name="street"
            value={formik.values.street}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="שם הרחוב ומספר"
            disabled={!isEditing}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>עיר</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="ירושלים"
                disabled={!isEditing}
              />
              <AiOutlineEnvironment className={styles.icon} />
            </div>
          </div>
          <div className={styles.field}>
            <label>מיקוד</label>
            <input
              type="text"
              name="zipCode"
              value={formik.values.zipCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="מיקוד"
              disabled={!isEditing}
            />
            {formik.touched.zipCode && formik.errors.zipCode && (
              <div className={styles.errorText}>{formik.errors.zipCode}</div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>
              <AiOutlineSave /> שמור שינויים
            </button>
            <button type="button" className={styles.cancelBtn} onClick={() => { formik.resetForm(); setIsEditing(false); }}>
              <AiOutlineClose /> ביטול
            </button>
          </div>
        )}
      </form>
    </div>
  )
};

export default Profile;
