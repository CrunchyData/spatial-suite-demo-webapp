import React from 'react';
import { TextContent, Text } from '@patternfly/react-core';

/**
 * Heading text for views
 * @param {Object} props
 * @param {string} props.children
 */
const FormHeading = ({ children }) => (
  <TextContent>
    <Text component="h2">{children}</Text>
  </TextContent>
);

export default FormHeading;
