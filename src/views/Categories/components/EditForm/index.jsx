import React, { useEffect, useState } from 'react';
import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import styles from './index.module.scss';

/** @typedef {import('api').Parcel} Parcel */

/**
 * Form for editing a parcel's risk
 * @param {Object} props
 * @param {Parcel} props.parcel - The parcel to be edited
 * @param {function(): void} props.onCancelButtonClick - Callback that gets called when the user
 *     clicks the cancel button
 * @param {function(Parcel): void} props.onSaveButtonClick - Callback that receives the edited
 *     parcel when the user clicks the "save" button
 */
const EditForm = props => {
  const { onCancelButtonClick, onSaveButtonClick } = props;

  const [parcel, setParcel] = useStateFromPropParcel(props.parcel);

  /**
   * <select> onChange handler
   * @param {'yes' | 'no'} isFireHazardStr - The <select> will pass this value as a string
   */
  const handleFireHazardChange = isFireHazardStr => {
    const isFireHazard = isFireHazardStr === 'yes';

    setParcel(prevParcel => ({
      ...prevParcel,
      isFireHazard,
    }));
  };

  /** <form> onSubmit handler */
  const handleFormSubmit = event => {
    event.preventDefault(); // Prevent the browser from refreshing
    onSaveButtonClick(parcel);
  };

  /** "save" button's onClick handler */
  const handleSaveButtonClick = () => {
    onSaveButtonClick(parcel);
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <FormGroup className={styles.formGroup} label="Is this parcel a fire hazard?">
        <FormSelect
          value={parcel.isFireHazard ? 'yes' : 'no'}
          onChange={handleFireHazardChange}
          aria-label="Is this parcel a fire hazard?"
        >
          <FormSelectOption value="yes" label="Yes" />
          <FormSelectOption value="no" label="No" />
        </FormSelect>
      </FormGroup>
      <ActionGroup className={styles.actionGroup}>
        <Button
          variant={ButtonVariant.secondary}
          onClick={onCancelButtonClick}
        >
          Cancel
        </Button>
        <Button
          variant={ButtonVariant.primary}
          onClick={handleSaveButtonClick}
        >
          Save
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

export default EditForm;
