import React, { useEffect, useState } from 'react';
import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
} from '@patternfly/react-core';
import SearchForm from './components/SearchForm';
import SearchResultsList from './components/SearchResultsList';
import styles from './index.module.scss';

/** @typedef {import('api').Parcel} Parcel */

/**
 * Form to search for all parcels within a specified radius surrounding the selected address and
 * return a list of parcels within that radius to be notified when reporting a fire.
 * @param {Object} props
 * @param {Parcel} props.parcel - The parcel to be edited
 * @param {function(): void} props.onCancelButtonClick - Callback that gets called when the user
 *     clicks the cancel button
 * @param {function(Parcel): void} props.onNotifyButtonClick - Callback that receives the edited
 *     parcel when the user clicks the "Notify" button
 */
const NotifyForm = props => {
  const { onCancelButtonClick, onNotifyButtonClick } = props;

  const [parcel] = useStateFromPropParcel(props.parcel);

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
    <Form onSubmit={handleFormSubmit}>
      <SearchForm />
      <SearchResultsList />
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
  );
};

/**
 * Updates local state parcel when a different parcel is passed in from props
 * @param {Parcel} propParcel - Parcel from props
 */
function useStateFromPropParcel(propParcel) {
  // Set initial state from parcel
  const [stateParcel, setStateParcel] = useState(propParcel);

  // If a different parcel is passed in from props, keep state in sync
  useEffect(
    () => { setStateParcel(propParcel); },
    [propParcel],
  );

  return [stateParcel, setStateParcel];
}

export default NotifyForm;
