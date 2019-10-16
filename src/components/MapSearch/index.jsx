import React from 'react';
import { Spinner } from '@patternfly/react-core/dist/esm/experimental';
import ParcelMap from './components/ParcelMap';
import SearchForm from './components/SearchForm';
import SearchResultsList from './components/SearchResultsList';
import useLocalStateController from './useLocalStateController';

/** @typedef {import('./useLocalStateController').Parcel} */

/**
 * Parcel map and search field
 * @param {Object} props
 * @param {function(Parcel): void} props.onSelectParcel - Callback to handle when the user selects
 *     a parcel from the map or search results
 */
const MapSearch = ({ onSelectParcel }) => {
  const { doParcelSearch, isSearchInProgress, searchResults } = useLocalStateController();

  const SearchResults = () => {
    if (isSearchInProgress) return <Spinner />;
    return (
      <SearchResultsList
        parcelSearchResults={searchResults}
        onSelectParcel={onSelectParcel}
      />
    );
  };

  return (
    <div>
      <ParcelMap />
      <SearchForm onSubmit={doParcelSearch} />
      <SearchResults />
    </div>
  );
};

export default MapSearch;
