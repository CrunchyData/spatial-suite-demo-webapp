import React, { useState } from 'react';
import {
  Button,
  ButtonVariant,
  FormGroup,
  InputGroup,
  TextInput,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import styles from '../../index.module.scss';

/** @typedef {function(string): void} SubmitHandler */

/**
 * Form with TextInput and search button
 * @param {Object} props
 * @param {SubmitHandler} props.onSubmit - Callback function to handle form submission
 */
const SearchForm = () => {
  const [value, setValue] = useState('');

  return (
    <FormGroup
      className={styles.formGroup}
      fieldId="mile-search"
      label="Search parcels within a distance of how many miles?"
    >
      <InputGroup>
        <TextInput
          id="mile-search"
          type="search"
          value={value}
          onChange={setValue}
          placeholder="50"
          aria-label="Search parcels within a distance of how many miles?"
        />
        <Button variant={ButtonVariant.control}>
          <SearchIcon />
        </Button>
      </InputGroup>
    </FormGroup>
  );
};

export default SearchForm;
