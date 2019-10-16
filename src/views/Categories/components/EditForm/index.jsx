import React, { useState } from 'react';
import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

/**
 * Form for editing a parcel's risk
 * @param {Object} props
 * @param {function(): void} props.onCancelButtonClick - Callback that gets called when the user
 *     clicks the cancel button
 * @param {function(string): void} props.onSaveButtonClick - Callback that receives the risk value
 *     from the form
 */
const EditForm = ({ onCancelButtonClick, onSaveButtonClick }) => {
  const [riskValue, setRiskValue] = useState('no');

  const handleFormSubmit = event => {
    event.preventDefault();
    onSaveButtonClick(riskValue);
  };

  const handleSaveButtonClick = () => {
    onSaveButtonClick(riskValue);
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <FormSelect
        value={riskValue}
        onChange={setRiskValue}
        aria-label="Is this parcel a risk?"
      >
        <FormSelectOption value="yes" label="Yes" />
        <FormSelectOption value="no" label="No" />
      </FormSelect>
      <ActionGroup>
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
