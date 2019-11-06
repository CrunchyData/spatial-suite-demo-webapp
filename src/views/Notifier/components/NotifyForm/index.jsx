import React from 'react';
import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  Text,
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import SearchForm from './components/SearchForm';
import SearchResultsList from './components/SearchResultsList';
import styles from './index.module.scss';

/**
 * DistanceSearch component props
 * @typedef {Object} DistanceSearchProps
 * @property {Store} store
 * @property {function(Parcel): void} onSelectParcel - Callback to handle when the user
 *     selects a parcel from the map or search results
 */
/**
 * Renders a loading spinner while the search is in progress, or the list of search results if
 *     the search has finished.
 * @param {Object} props
 * @param {Store} props.store
 * @param {DistanceSearchProps['onSelectParcel']} props.onSelectParcel
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
 * Distance search form
 * @param {DistanceSearchProps} props
 */
const DistanceSearch = ({ store, onSelectParcel, parcel }) => {
  const { errorMessage, search } = store;

  const handleSubmit = distance => {
    search(parcel.id, distance);
  };

  return (
    <div className={styles.container}>
      <SearchForm onSubmit={handleSubmit} />
      {errorMessage ? (
        <Text>{errorMessage}</Text>
      ) : (
        <SearchResults
          onSelectParcel={onSelectParcel}
          store={store}
        />
      )}
    </div>
  );
};

/** @typedef {import('api').Parcel} Parcel */

/**
 * Form to search for all parcels within a specified radius surrounding the selected address and
 * return a list of parcels within that radius to be notified when reporting a fire.
 * @param {Object} props
 * @param {function(): void} props.onCancelButtonClick - Callback that gets called when the user
 *     clicks the cancel button
 * @param {function(Parcel): void} props.onNotifyButtonClick - Callback that receives the edited
 *     parcel when the user clicks the "Notify" button
 * @property {function(Parcel): void} onSelectParcel - Callback to handle when the user
 *     selects a parcel from the map or search results
 * @param {Parcel} parcel - The parcel to be edited
 * @property {Store} store
 */
const NotifyForm = props => {
  const {
    onCancelButtonClick,
    onNotifyButtonClick,
    onSelectParcel,
    parcel,
    store,
  } = props;

  /** <form> onSubmit handler */
  const handleFormSubmit = event => {
    event.preventDefault(); // Prevent the browser from refreshing
    onNotifyButtonClick(parcel);
  };

  /** "Notify" button's onClick handler */
  const handleNotifyButtonClick = () => {
    onNotifyButtonClick(parcel);
  };

  return (
    <div>
      <DistanceSearch
        store={store}
        onSelectParcel={onSelectParcel}
        parcel={parcel}
      />
      <Form onSubmit={handleFormSubmit}>
        <ActionGroup className={styles.actionGroup}>
          <Button
            variant={ButtonVariant.secondary}
            onClick={onCancelButtonClick}
          >
            Cancel
          </Button>
          <Button
            variant={ButtonVariant.primary}
            onClick={handleNotifyButtonClick}
          >
            Notify
          </Button>
        </ActionGroup>
      </Form>
    </div>
  );
};

export default NotifyForm;
