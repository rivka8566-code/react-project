import type { FC } from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = () => (
  <div className={styles.SearchBar}>
    SearchBar Component
  </div>
);

export default SearchBar;
