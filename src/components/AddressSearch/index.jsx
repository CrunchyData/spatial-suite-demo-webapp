// @ts-check
import React from 'react';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import SearchForm from './components/SearchForm';
import SearchResultsList from './components/SearchResultsList';
import styles from './index.module.scss';

/** @typedef {import('api').Parcel} Parcel */
/** @typedef {ReturnType<typeof import('./useAddressSearchStore').default>} Store */

/**
 * AddressSearch component props
 * @typedef {Object} AddressSearchProps
 * @property {Store} store
 * @property {function(Parcel): void} onSelectParcel - Callback to handle when the user
 *     selects a parcel from the map or search results
 */

/**
 * Renders a loading spinner while the search is in progress, or the list of search results if
 *     the search has finished.
 * @param {Object} props
 * @param {Store} props.store
 * @param {AddressSearchProps['onSelectParcel']} props.onSelectParcel
 */
const SearchResults = ({ onSelectParcel, store }) => {
  const { isSearchInProgress, searchResults } = store;

  if (isSearchInProgress) return <Spinner />;

  return (
    <SearchResultsList
      parcelSearchResults={searchResults}
      onSelectParcel={onSelectParcel}
    />
  );
};

/**
 * Address search form
 * @param {AddressSearchProps} props
 */
const AddressSearch = ({ store, onSelectParcel }) => {
  const { errorMessage, search } = store;

  return (
    <div className={styles.container}>
      <SearchForm onSubmit={search} />
      {errorMessage || (
        <SearchResults
          onSelectParcel={onSelectParcel}
          store={store}
        />
      )}
    </div>
  );
};

export default AddressSearch;
