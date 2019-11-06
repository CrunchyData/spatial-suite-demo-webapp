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
import useAddressSearchStore from 'components/AddressSearch/useAddressSearchStore';
import useDistanceSearchStore from './components/useDistanceSearchStore';
import NotifyForm from './components/NotifyForm';
import styles from './index.module.css';

/** @typedef {import('api').Parcel} Parcel */

/** @type {Parcel | null} */
const selectedParcelInitialState = null;

const ChooseParcelText = () => (
  <TextContent>
    <Text>Please search for an address or select a parcel to notify.</Text>
  </TextContent>
);

const Notifier = () => {
  const [selectedParcel, setSelectedParcel] = useState(selectedParcelInitialState);
  const addressSearchStore = useAddressSearchStore();
  const distanceSearchStore = useDistanceSearchStore();

  const handleCancelButtonClick = () => {
    // Deselect the parcel and clear search results
    setSelectedParcel(selectedParcelInitialState);
    addressSearchStore.clearSearchResults();
  };

  const handleNotifyButtonClick = parcel => {
    // TODO: Send notification about selected parcels to backend
    // Send a notification about selected parcel and clear search results
    setSelectedParcel(parcel);
    addressSearchStore.clearSearchResults();
  };

  const handleSelectParcelSearchResult = parcel => {
    // Set selected parcel and clear search results
    setSelectedParcel(parcel);
    addressSearchStore.clearSearchResults();
  };

  const expandedContent = Boolean(
    selectedParcel
    || addressSearchStore.isSearchInProgress
    || addressSearchStore.searchResults.length,
  );

  const classes = expandedContent ? `${styles.card} ${styles.expanded}` : `${styles.card}`;

  return (
    <PageSection variant={PageSectionVariants.light} className={styles.pageSection}>
      <ParcelMap onParcelClick={setSelectedParcel} />

      <Card className={classes}>
        <CardBody>
          <AddressSearch
            store={addressSearchStore}
            onSelectParcel={handleSelectParcelSearchResult}
          />
          {
          selectedParcel
            ? (
              <NotifyForm
                store={distanceSearchStore}
                onSelectParcel={handleSelectParcelSearchResult}
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
