// @ts-check
import React from 'react';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import ErrorMessage from 'components/ErrorMessage';
import SearchForm from './components/SearchForm';
import styles from './index.module.scss';

/** @typedef {ReturnType<typeof import('./useAddressSearchStore').default>} Store */

/**
 * Address search form
 * @param {Object} props
 * @param {Store} props.store
 */
const AddressSearch = ({ store }) => {
  const { errorMessage, isLoading, search } = store;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.container}>
      <SearchForm onSubmit={search} />
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
};

export default AddressSearch;
