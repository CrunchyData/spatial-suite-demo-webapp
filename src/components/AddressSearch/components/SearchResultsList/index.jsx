import React from 'react';
import { List, Button, ListItem } from '@patternfly/react-core';
import styles from './index.module.scss';

/** @typedef {import('api').Parcel} Parcel */

/**
 * Lists search results
 * @param {Object} props
 * @param {function(Parcel): void} props.onSelectParcel
 * @param {Array<Parcel>} props.parcelSearchResults
 */
const SearchResultsList = ({ onSelectParcel, parcelSearchResults }) => (
  <List className={styles.list}>
    {parcelSearchResults.map((parcel, idx) => {
      const handleClick = () => {
        onSelectParcel(parcel);
      };

      return (
        <ListItem key={idx}>
          <Button variant="link" onClick={handleClick}>
            {parcel.address}
          </Button>
        </ListItem>
      );
    })}
  </List>
);

export default SearchResultsList;
