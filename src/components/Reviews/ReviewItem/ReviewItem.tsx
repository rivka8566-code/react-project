import { useState, type FC } from 'react';
import { AiOutlineDelete, AiFillStar } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { deleteReview } from '../../../Services/api';
import type { Review } from '../../../models/Review';
import styles from './ReviewItem.module.scss';

interface ReviewItemProps {
  review: Review;
  isAdmin: boolean;
  isTheAuthor: boolean;
}

const ReviewItem: FC<ReviewItemProps> = (props: ReviewItemProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      await deleteReview(props.review.id);
      toast.success('החוות דעת נמחקה בהצלחה');
      window.location.reload();
    } catch (error) {
      toast.error('שגיאה במחיקת החוות דעת');
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <AiFillStar
        key={index}
        className={index < props.review.rating ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  return (
    <div className={styles.ReviewItem}>
      {(props.isAdmin || props.isTheAuthor) && (
        <button 
          className={styles.deleteButton} 
          onClick={() => setShowDeleteModal(true)}
          disabled={showDeleteModal}
        >
          <AiOutlineDelete />
        </button>
      )}
      
      <div className={styles.header}>
        <div className={styles.rightContent}>
          <span className={styles.userName}>{props.review.userName}</span>
          <div className={styles.stars}>{renderStars()}</div>
          <span className={styles.date}>{formatDate(props.review.date)}</span>
        </div>
      </div>
      
      <p className={styles.comment}>{props.review.comment}</p>

      {showDeleteModal && (
        <>
          <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)} />
          <div className={styles.deleteModal}>
            <p>האם אתה בטוח שברצונך למחוק את החוות דעת?</p>
            <div className={styles.modalButtons}>
              <button className={styles.cancelBtn} onClick={() => setShowDeleteModal(false)}>
                ביטול
              </button>
              <button className={styles.confirmBtn} onClick={handleDelete}>
                מחק
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewItem;
