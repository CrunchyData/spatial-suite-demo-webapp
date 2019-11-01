import React, { useState } from 'react';
import {
  Button,
  ButtonVariant,
  InputGroup,
  Text,
  TextInput,
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';

/** @typedef {function(string): void} SubmitHandler */

/**
 * Form with TextInput and search button
 * @param {Object} props
 * @param {SubmitHandler} props.onSubmit - Callback function to handle form submission
 */
const SearchForm = () => {
  const [value, setValue] = useState('');

  return (
    <InputGroup>
      <Text>
        Search parcels within a distance of
      </Text>
      <TextInput
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
  );
};

export default SearchForm;
