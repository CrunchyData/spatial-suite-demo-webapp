import React, { useState } from 'react';
import {
  Card,
  CardBody,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
} from '@patternfly/react-core';
import AddressSearch from 'components/AddressSearch';
import useAddressSearchStore from 'components/AddressSearch/useAddressSearchStore';
import NotifyForm from './components/NotifyForm';
import styles from './index.module.css';

/** @typedef {import('api').Parcel} Parcel */

/** @type {Parcel | null} */
const selectedParcelInitialState = null;

const ChooseParcelText = () => (
  <TextContent>
    <Text>Select a parcel to notify.</Text>
  </TextContent>
);

const Notifier = () => {
  const [selectedParcel, setSelectedParcel] = useState(selectedParcelInitialState);
  const addressSearchStore = useAddressSearchStore();

  const handleCancelButtonClick = () => {
    // Deselect the parcel
    setSelectedParcel(selectedParcelInitialState);
  };

  const handleNotifyButtonClick = parcel => {
    // TODO: Send notification about selected parcels to backend
    setSelectedParcel(parcel);
  };

  const classes = selectedParcel ? `${styles.card} ${styles.expanded}` : `${styles.card}`;

  return (
    <PageSection variant={PageSectionVariants.light} className={styles.pageSection}>
      <AddressSearch store={addressSearchStore} onSelectParcel={setSelectedParcel} />

      <Card className={classes}>
        <CardBody>
          {
          selectedParcel
            ? (
              <NotifyForm
                onCancelButtonClick={handleCancelButtonClick}
                onNotifyButtonClick={handleNotifyButtonClick}
                parcel={selectedParcel}
              />
            )
            : <ChooseParcelText />
          }
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default Notifier;
