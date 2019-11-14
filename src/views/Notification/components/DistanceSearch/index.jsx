// @ts-check
import React from 'react';
import {
  TextInput,
  FormGroup,
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import ErrorMessage from 'components/ErrorMessage';
import SearchResultsList from './components/SearchResultsList';
import styles from '../../index.module.css';

/** @typedef {ReturnType<typeof import('../useDistanceSearchStore')['default']>} Store */

/**
 * Renders a loading spinner while the search is in progress, or the list of search results if
 *     the search has finished.
 * @param {Object} props
 * @param {Store} props.store
 */
const SearchResults = ({ store }) => {
  const { isSearchInProgress, searchResults } = store;

  if (isSearchInProgress) return <Spinner />;

  return (
    <SearchResultsList parcelSearchResults={searchResults} />
  );
};

/**
 * Distance search form
 * @param {Object} props
 * @param {Store} props.store
 */
const DistanceSearch = ({ store }) => {
  const {
    distance,
    errorMessage,
    setDistance,
  } = store;

  return (
    <>
      <FormGroup
        className={styles.formGroup}
        fieldId="distance-search"
        label="Search parcels within a distance of how many meters?"
      >
        <TextInput
          id="distance-search"
          placeholder="distance in meters"
          onChange={setDistance}
          value={distance}
        />
      </FormGroup>
      {
        errorMessage
          ? <ErrorMessage>{errorMessage}</ErrorMessage>
          : <SearchResults store={store} />
      }
    </>
  );
};

export default DistanceSearch;
