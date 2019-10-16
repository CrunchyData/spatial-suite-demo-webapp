import React from 'react';
import { TextContent, Text } from '@patternfly/react-core';

/**
 * Heading text for views
 * @param {Object} props
 * @param {string} props.children
 */
const ViewHeading = ({ children }) => (
  <TextContent>
    <Text component="h1">{children}</Text>
  </TextContent>
);

export default ViewHeading;
