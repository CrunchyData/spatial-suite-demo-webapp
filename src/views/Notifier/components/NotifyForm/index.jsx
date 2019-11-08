// @ts-check
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
  const { errorMessage, search } = store;

  const handleSubmit = distance => {
    search(distance);
  };

  return (
    <div className={styles.container}>
      <SearchForm onSubmit={handleSubmit} />
      {errorMessage ? (
        <Text>{errorMessage}</Text>
      ) : (
        <SearchResults store={store} />
      )}
    </div>
  );
};

/**
 * Form to search for all parcels within a specified radius surrounding the selected address and
 * return a list of parcels within that radius to be notified when reporting a fire.
 * @param {Object} props
 * @param {function(): void} props.onCancelButtonClick - Callback that gets called when the user
 *     clicks the cancel button
 * @param {function(): void} props.onNotifyButtonClick - Callback that receives the edited
 *     parcel when the user clicks the "Notify" button
 * @param {Store} props.distanceSearchStore
 */
const NotifyForm = props => {
  const {
    onCancelButtonClick,
    onNotifyButtonClick,
    distanceSearchStore,
  } = props;

  /** <form> onSubmit handler */
  const handleFormSubmit = event => {
    event.preventDefault(); // Prevent the browser from refreshing
    onNotifyButtonClick();
  };

  /** "Notify" button's onClick handler */
  const handleNotifyButtonClick = () => {
    onNotifyButtonClick();
  };

  return (
    <div>
      <DistanceSearch store={distanceSearchStore} />
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
