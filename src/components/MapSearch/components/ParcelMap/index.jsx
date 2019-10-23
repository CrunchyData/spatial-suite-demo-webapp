import React from 'react';
import OLMap from 'components/OLMap';
import styles from './index.module.css';

const ParcelMap = () => (
  <div className={styles.square}>
    <div className={styles.content}>
      <OLMap />
    </div>
  </div>
);

export default ParcelMap;
