// @ts-check
import React from 'react';
import {
  Alert,
  AlertActionCloseButton,
} from '@patternfly/react-core';
import styles from './index.module.css';

const NotificationAlert = props => {
  const { onClose } = props;

  return (
    <Alert
      className={styles.root}
      variant="success"
      title="Successfully Notified"
      action={<AlertActionCloseButton onClose={onClose} />}
    >
      Homeowners have been notified!
    </Alert>
  );
};

export default NotificationAlert;
