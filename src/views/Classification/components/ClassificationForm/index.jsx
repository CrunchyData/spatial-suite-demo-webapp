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
 * @param {number | string} props.parcelId
*/
const ClassificationForm = props => {
  const {
    onCancelButtonClick,
    onSaveButtonClick,
    parcelId,
  } = props;

  const fireHazardStore = useFireHazardStore(parcelId);

  /** @param {'Yes' | 'No'} isFireHazardStr - The string passed in from the <FormSelect> */
  const handleChange = isFireHazardStr => {
    const isFireHazard = isFireHazardStr === 'Yes';
    fireHazardStore.setFireHazard(isFireHazard);
  };

  /** <form> onSubmit handler */
  const handleFormSubmit = () => {
    fireHazardStore.submit()
      .then(() => { onSaveButtonClick(); });
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
          value={fireHazardStore.isFireHazard ? 'Yes' : 'No'}
          onChange={handleChange}
          aria-label="Is this parcel a fire hazard?"
        >
          <FormSelectOption value="Yes" label="Yes" />
          <FormSelectOption value="No" label="No" />
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
          onClick={handleFormSubmit}
        >
          Save
        </Button>
      </ActionGroup>
    </Form>
  );
};

export default ClassificationForm;
