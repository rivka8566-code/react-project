import type { FC } from 'react';
import styles from './ReviewItem.module.scss';

interface ReviewItemProps {}

const ReviewItem: FC<ReviewItemProps> = () => (
  <div className={styles.ReviewItem}>
    ReviewItem Component
  </div>
);

export default ReviewItem;
