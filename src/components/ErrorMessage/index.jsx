import React from 'react';
import { TextContent, Text } from '@patternfly/react-core';
import styles from './index.module.css';

/**
 * Displays an error message
 * @type {React.FC}
 */
const ErrorMessage = ({ children }) => (
  <TextContent>
    <Text className={styles.root}>{children}</Text>
  </TextContent>
);

export default ErrorMessage;
