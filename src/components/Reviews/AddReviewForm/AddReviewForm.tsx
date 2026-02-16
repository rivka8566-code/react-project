import { useState, type FC } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiFillStar } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { createReview } from '../../../Services/api';
import styles from './AddReviewForm.module.scss';
import { Review } from '../../../models/Review';

interface AddReviewFormProps {
  productId: number;
  userId: number;
  userName: string;
  onCancel: () => void;
}

const AddReviewForm: FC<AddReviewFormProps> = ({ productId, userId, userName, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingError, setRatingError] = useState('');

  const formik = useFormik({
    initialValues: {
      comment: ''
    },
    validationSchema: Yup.object({
      comment: Yup.string().required('חובה לכתוב תגובה')
    }),
    onSubmit: async (values, { resetForm }) => {
      if (rating === 0) {
        setRatingError('חובה לבחור דירוג');
        return;
      }
      setRatingError('');
      try {
        await createReview({
          ...new Review(),
          productId,
          userId,
          userName,
          rating,
          comment: values.comment,
          date: new Date().toISOString().split('T')[0]
        });
        toast.success('חוות הדעת נוספה בהצלחה');
        resetForm();
        setRating(0);
        window.location.reload();
      } catch (error) {
        toast.error('שגיאה בהוספת חוות הדעת');
      }
    }
  });

  return (
    <div className={styles.AddReviewForm}>
      <h2>הוסף חוות דעת</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.ratingSection}>
          <label>דירוג:</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <AiFillStar
                key={star}
                className={star <= (hoverRating || rating) ? styles.starFilled : styles.starEmpty}
                onClick={() => { setRating(star); setRatingError(''); }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          {ratingError && <span className={styles.errorText}>{ratingError}</span>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="comment">התגובה שלך:</label>
          <textarea
            id="comment"
            name="comment"
            rows={4}
            value={formik.values.comment}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={formik.touched.comment && formik.errors.comment ? styles.error : ''}
          />
          {formik.touched.comment && formik.errors.comment && (
            <span className={styles.errorText}>{formik.errors.comment}</span>
          )}
        </div>
        <div className={styles.buttons}>
          <button type="submit" className={styles.submitBtn}>שלח חוות דעת</button>
          <button type="button" className={styles.cancelBtn} onClick={() => { formik.resetForm(); setRating(0); setRatingError(''); onCancel(); }}>ביטול</button>
        </div>
      </form>
    </div>
  )
};

export default AddReviewForm;
