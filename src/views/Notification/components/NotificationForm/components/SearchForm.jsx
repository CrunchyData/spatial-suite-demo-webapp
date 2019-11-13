import React, { useState } from 'react';
import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  InputGroup,
  TextInput,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import styles from '../index.module.scss';

/** @typedef {function(string): void} SubmitHandler */

/**
 * Form with a label, TextInput, and search button
 * @param {Object} props
 * @param {SubmitHandler} props.onSubmit - Callback function to handle form submission
 */
const SearchForm = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(value);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup
        className={styles.formGroup}
        fieldId="distance-search"
        label="Search parcels within a distance of how many meters?"
      >
        <InputGroup>
          <TextInput
            id="distance-search"
            type="search"
            value={value}
            onChange={setValue}
            placeholder="50"
            aria-label="Search parcels within a distance of how many meters?"
          />
          <Button disabled={!value} variant={ButtonVariant.control} onClick={handleSubmit}>
            <SearchIcon />
          </Button>
        </InputGroup>
      </FormGroup>
    </Form>
  );
};

export default SearchForm;
