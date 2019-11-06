// @ts-check
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
import ParcelMap from 'components/ParcelMap';
import EditForm from './components/EditForm';
import styles from './index.module.css';

/** @typedef {import('api').Parcel} Parcel */

/** @type {Parcel | null} */
const selectedParcelInitialState = null;

const ChooseParcelText = () => (
  <TextContent>
    <Text>Please search for a specific address or select a parcel from the map.</Text>
  </TextContent>
);

const Categories = () => {
  const [selectedParcel, setSelectedParcel] = useState(selectedParcelInitialState);
  const [hasSearchResults, setHasSearchResults] = useState(false);

  const handleCancelButtonClick = () => {
    // Deselect the parcel
    setSelectedParcel(selectedParcelInitialState);
  };

  const handleSaveButtonClick = parcel => {
    // TODO: Send parcel updates to backend
    setSelectedParcel(parcel);
  };

  const expandedContent = selectedParcel || hasSearchResults;

  const classes = expandedContent ? `${styles.card} ${styles.expanded}` : `${styles.card}`;

  return (
    <PageSection variant={PageSectionVariants.light} className={styles.pageSection}>
      <ParcelMap onParcelClick={setSelectedParcel} />

      <Card className={classes}>
        <CardBody>
          <AddressSearch
            onSelectParcel={setSelectedParcel}
            onHasSearchResults={setHasSearchResults}
          />
          {
          selectedParcel
            ? (
              <EditForm
                onCancelButtonClick={handleCancelButtonClick}
                onSaveButtonClick={handleSaveButtonClick}
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

export default Categories;
