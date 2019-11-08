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
import useAddressSearchStore from 'components/AddressSearch/useAddressSearchStore';
import useDistanceSearchStore from './components/useDistanceSearchStore';
import NotifyForm from './components/NotifyForm';
import styles from './index.module.css';

/** @typedef {import('api').ParcelCoords} ParcelCoords */
/** @typedef {import('components/ParcelMap/CrunchyMap').ParcelFromMap} ParcelFromMap */

/** @type {ParcelFromMap | null} */
const parcelFromMapInitialState = null;

const ChooseParcelText = () => (
  <TextContent>
    <Text>Please search for an address or select a parcel to notify.</Text>
  </TextContent>
);

/**
 * Displays parcel details
 * @param {Object} props
 * @param {ParcelFromMap} props.parcelFromMap
 */
const ParcelDetails = ({ parcelFromMap }) => {
  const { apn, id, isFireHazard } = parcelFromMap;

  return (
    <TextContent>
      <Text>ID: {id}</Text>
      <Text>APN: {apn}</Text>
      <Text>Fire hazard: {isFireHazard ? 'Yes' : 'No'}</Text>
    </TextContent>
  );
};

const Notifier = () => {
  const [parcelFromMap, setParcelFromMap] = useState(parcelFromMapInitialState);
  const addressSearchStore = useAddressSearchStore();
  const parcelId = (
    (addressSearchStore.searchResult && addressSearchStore.searchResult.parcelid)
    || (parcelFromMap && parcelFromMap.id)
  );
  const distanceSearchStore = useDistanceSearchStore(parcelId);

  const resetView = () => {
    setParcelFromMap(parcelFromMapInitialState);
    addressSearchStore.clearSearchResult();
    distanceSearchStore.clearSearchResults();
  };

  const handleCancelButtonClick = resetView;

  const handleNotifyButtonClick = () => {
    // TODO: Send notification about selected parcels to backend
    // Send a notification about selected parcel and clear search results
    resetView();
  };

  const expandedContent = Boolean(
    addressSearchStore.searchResult
    || addressSearchStore.isLoading
    || parcelFromMap,
  );

  const classes = expandedContent ? `${styles.card} ${styles.expanded}` : `${styles.card}`;

  return (
    <PageSection variant={PageSectionVariants.light} className={styles.pageSection}>
      <ParcelMap
        parcelCoords={addressSearchStore.searchResult}
        onParcelClick={setParcelFromMap}
        surroundingParcels={distanceSearchStore.searchResults}
      />

      <Card className={classes}>
        <CardBody>
          <AddressSearch store={addressSearchStore} />
          {parcelFromMap && <ParcelDetails parcelFromMap={parcelFromMap} />}
          {
          (parcelFromMap || addressSearchStore.searchResult)
            ? (
              <NotifyForm
                distanceSearchStore={distanceSearchStore}
                onCancelButtonClick={handleCancelButtonClick}
                onNotifyButtonClick={handleNotifyButtonClick}
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
