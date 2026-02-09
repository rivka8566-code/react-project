import type { FC } from 'react';
import styles from './ReviewList.module.scss';

interface ReviewListProps {}

const ReviewList: FC<ReviewListProps> = () => (
  <div className={styles.ReviewList}>
    ReviewList Component
  </div>
);

export default ReviewList;
