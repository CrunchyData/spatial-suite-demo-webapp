import React from 'react';
import { Spinner } from '@patternfly/react-core/dist/esm/experimental';
import api from 'api';
import ParcelMap from './components/ParcelMap';
import SearchForm from './components/SearchForm';
import SearchResultsList from './components/SearchResultsList';

/** @typedef {import('./useLocalStateController').Parcel} */

/**
 * @typedef {Object} Props
 * @property {function(Parcel): void} props.onSelectParcel - Callback to handle when the user
 *     selects a parcel from the map or search results
 */

/**
 * Parcel map and search field
 * @extends {React.Component<Props>}
 */
class MapSearch extends React.Component {
  state = {
    errorMessage: '',
    isSearchInProgress: false,
    searchResults: [],
  }

  /**
   * Performs a parcel search with the backend
   * @param {string} queryText
   */
  doParcelSearch = queryText => {
    // Update state to indicate that there is a search in progress
    this.setState({
      isSearchInProgress: true,
      searchResults: [],
      errorMessage: '',
    });

    // Perform the API request
    api.parcels.search(queryText)
      .then(searchResults => {
        // Request was successful. Store results in state.
        this.setState({
          isSearchInProgress: false,
          searchResults,
        });
      })
      .catch(() => {
        // Request was unsuccessful.
        this.setState({
          isSearchInProgress: false,
          errorMessage: 'An error occurred',
        });
      });
  }

  render() {
    // Alias some things
    const { onSelectParcel } = this.props;
    const { errorMessage, isSearchInProgress, searchResults } = this.state;
    const { doParcelSearch } = this;

    /**
     * Renders a loading spinner while the search is in progress, or the list of search results if
     *     the search has finished.
     */
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
        {errorMessage || <SearchResults />}
      </div>
    );
  }
}

export default MapSearch;
