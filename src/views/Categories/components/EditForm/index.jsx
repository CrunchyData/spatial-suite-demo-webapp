import React from 'react';
import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import useFireHazardStore from './useFireHazardStore';
import styles from './index.module.scss';

/**
 * Form for editing a parcel's risk
 * @param {Object} props
 * @param {function(): void} props.onCancelButtonClick - Callback that gets called when the user
 *     clicks the cancel button
 * @param {function(Parcel): void} props.onSaveButtonClick - Callback that receives the edited
 *     parcel when the user clicks the "save" button
 * @param {string} isFireHazard
 * @param {number | string} parcelId
 */
const EditForm = props => {
  const {
    onCancelButtonClick,
    onSaveButtonClick,
    isFireHazard,
    parcelId,
  } = props;

  const fireHazardStore = useFireHazardStore(isFireHazard, parcelId);

  /** <form> onSubmit handler */
  const handleFormSubmit = event => {
    event.preventDefault(); // Prevent the browser from refreshing
    onSaveButtonClick();
  };

  /** "Save" button's onClick handler */
  const handleSaveButtonClick = () => {
    onSaveButtonClick();
  };

  const handleFireHazardChange = () => {
    fireHazardStore.submit();
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <FormGroup
        className={styles.formGroup}
        fieldId="fire-hazard"
        label="Is this parcel a fire hazard?"
      >
        <FormSelect
          id="fire-hazard"
          value={isFireHazard ? 'yes' : 'no'}
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

export default EditForm;
