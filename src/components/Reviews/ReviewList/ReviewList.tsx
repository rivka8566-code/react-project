import { useEffect, useState, type FC } from 'react';
import styles from './ReviewList.module.scss';
import { Review } from '../../../models/Review';
import { getReviewsByProductId } from '../../../Services/api';
import ReviewItem from '../ReviewItem/ReviewItem';

interface ReviewListProps {
  idProduct: number;
  idUser: number;
  isAdmin: boolean;
}

const ReviewList: FC<ReviewListProps> = (props: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsByProductId(props.idProduct);
        setReviews(response);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    fetchReviews();
  }, [props.idProduct]);

  return (    
    <div className={styles.ReviewList}>
      {reviews && reviews.length === 0 ? (
        <p className={styles.noReviews}>
          אין חוות דעת עדיין.{!props.isAdmin && ' היה הראשון להוסיף!'}
        </p>
      ) : (
        reviews?.map(review => (
          <ReviewItem key={review.id} review={review} isAdmin={props.isAdmin || false} isTheAuthor={props.idUser == review.userId}></ReviewItem>
        ))
      )}
    </div>
  );
};

export default ReviewList;
