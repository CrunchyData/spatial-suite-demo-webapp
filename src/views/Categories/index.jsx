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
import EditForm from './components/EditForm';
import styles from './index.module.css';

/** @typedef {import('api').ParcelCoords} ParcelCoords */
/** @typedef {import('components/ParcelMap/CrunchyMap').ParcelFromMap} ParcelFromMap */

/** @type {ParcelFromMap | null} */
const parcelFromMapInitialState = null;

const ChooseParcelText = () => (
  <TextContent>
    <Text>Please search for a specific address or select a parcel from the map.</Text>
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

const Categories = () => {
  const [parcelFromMap, setParcelFromMap] = useState(parcelFromMapInitialState);
  const addressSearchStore = useAddressSearchStore();

  const resetView = () => {
    setParcelFromMap(parcelFromMapInitialState);
    addressSearchStore.clearSearchResult();
  };

  const handleCancelButtonClick = resetView;

  const handleSaveButtonClick = () => {
    // TODO: Send parcel updates to backend
    // Send parcel updates and clear search results
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
      />

      <Card className={classes}>
        <CardBody>
          <AddressSearch store={addressSearchStore} />
          {parcelFromMap && <ParcelDetails parcelFromMap={parcelFromMap} />}
          {
          (parcelFromMap || addressSearchStore.searchResult)
            ? (
              <EditForm
                onCancelButtonClick={handleCancelButtonClick}
                onSaveButtonClick={handleSaveButtonClick}
              />
            ) : <ChooseParcelText />
          }
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default Categories;
