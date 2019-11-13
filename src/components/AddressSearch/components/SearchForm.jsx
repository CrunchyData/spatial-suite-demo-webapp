import React, { useState } from 'react';
import {
  Button,
  ButtonVariant,
  Form,
  InputGroup,
  TextInput,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

/** @typedef {function(string): void} SubmitHandler */

/**
 * Form with TextInput and search button
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
      <InputGroup>
        <TextInput
          type="search"
          value={value}
          onChange={setValue}
          placeholder="Address search..."
          aria-label="Search parcel addresses"
        />
        <Button disabled={!value} variant={ButtonVariant.control} onClick={handleSubmit}>
          <SearchIcon />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchForm;
