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
import useViewCardStyles from 'hooks/useViewCardStyles';
import EditForm from './components/EditForm';
import styles from './index.module.css';

/** @typedef {import('api').ParcelCoords} ParcelCoords */
/** @typedef {import('components/ParcelMap/CrunchyMap').ParcelFromMap} ParcelFromMap */

// IDs for dynamically resizing the card
const VIEW_CONTAINER_ID = 'categoriesView';
const CARD_BODY_ID = 'categoriesCardBody';

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
    resetView();
  };

  // Generate the `style` object for the floating card
  const cardStyle = useViewCardStyles(VIEW_CONTAINER_ID, CARD_BODY_ID);

  return (
    <PageSection
      id={VIEW_CONTAINER_ID}
      variant={PageSectionVariants.light}
      className={styles.pageSection}
    >
      <ParcelMap
        parcelCoords={addressSearchStore.searchResult}
        onParcelClick={setParcelFromMap}
      />

      <Card className={styles.card} style={cardStyle}>
        <CardBody id={CARD_BODY_ID}>
          <AddressSearch store={addressSearchStore} />
          {parcelFromMap && <ParcelDetails parcelFromMap={parcelFromMap} />}
          {
          (parcelFromMap || addressSearchStore.searchResult)
            ? (
              <EditForm
                onCancelButtonClick={handleCancelButtonClick}
                onSaveButtonClick={handleSaveButtonClick}
                parcelId={parcelFromMap && parcelFromMap.id}
              />
            ) : <ChooseParcelText />
          }
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default Categories;
