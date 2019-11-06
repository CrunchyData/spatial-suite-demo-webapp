import React from 'react';
import { List, Button, ListItem } from '@patternfly/react-core';
import styles from '../../index.module.scss';

/**
 * Lists search results
 * TODO: List results from backend
 */
const SearchResultsList = () => {
  const handleClick = event => {
    event.preventDefault();
  };

  return (
    <List className={styles.list}>
      <ListItem>
        <Button variant="link" onClick={handleClick}>
          Example Address
        </Button>
      </ListItem>
    </List>
  );
};

export default SearchResultsList;
