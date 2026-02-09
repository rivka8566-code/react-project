import type { FC } from 'react';
import styles from './Home.module.scss';

interface HomeProps {}

const Home: FC<HomeProps> = () => (
  <div className={styles.Home}>
    Home Component
  </div>
);

export default Home;
