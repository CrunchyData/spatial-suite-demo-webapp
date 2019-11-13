import React from 'react';
import { List, ListItem } from '@patternfly/react-core';
import styles from './index.module.scss';

/** @typedef {import('api').SurroundingParcel} SurroundingParcel */

/**
 * Lists search results - all parcels located within the specified distance
 * @param {Object} props
 * @param {Array<SurroundingParcel>} props.parcelSearchResults
 */
const SearchResultsList = ({ parcelSearchResults }) => (
  <List className={styles.list}>
    {parcelSearchResults.map((parcel, idx) => (
      <ListItem key={idx}>
        {parcel.address || `PARCEL ID: ${parcel.parcelid}`}
      </ListItem>
    ))}
  </List>
);

export default SearchResultsList;
