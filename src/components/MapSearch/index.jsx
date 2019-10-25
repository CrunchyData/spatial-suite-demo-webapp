import React from 'react';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import api from 'api';
import ParcelMap from 'components/ParcelMap';
import SearchForm from './components/SearchForm';
import SearchResultsList from './components/SearchResultsList';
import styles from './index.module.css';

/** @typedef {import('api').Parcel} Parcel */

/**
 * MapSearch component props
 * @typedef {Object} Props
 * @property {function(Parcel): void} onSelectParcel - Callback to handle when the user
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
  doParcelSearch = async queryText => {
    // Update state to indicate that there is a search in progress
    this.setState({
      isSearchInProgress: true,
      searchResults: [],
      errorMessage: '',
    });

    try {
      const searchResults = await api.parcels.search(queryText);

      // Store results in state
      this.setState({
        isSearchInProgress: false,
        searchResults,
      });
    } catch {
      // Request was unsuccessful
      this.setState({
        isSearchInProgress: false,
        errorMessage: 'An error occurred',
      });
    }
  };

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
        <div className={styles.square}>
          <div className={styles.content}>
            <ParcelMap />
          </div>
        </div>
        <SearchForm onSubmit={doParcelSearch} />
        {errorMessage || <SearchResults />}
      </div>
    );
  }
}

export default MapSearch;
