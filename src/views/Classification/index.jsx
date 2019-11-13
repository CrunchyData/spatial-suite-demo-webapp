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
import FormHeading from 'components/FormHeading';
import useAddressSearchStore from 'components/AddressSearch/useAddressSearchStore';
import useViewCardStyles from 'hooks/useViewCardStyles';
import usePubSub from 'hooks/usePubSub';
import ClassificationForm from './components/ClassificationForm';
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
    <TextContent className={styles.parcelDetails}>
      <Text><strong>ID:</strong> {id}</Text>
      <Text><strong>APN:</strong> {apn}</Text>
      <Text><strong>Fire hazard:</strong> {isFireHazard ? 'Yes' : 'No'}</Text>
    </TextContent>
  );
};

const Classification = () => {
  const [parcelFromMap, setParcelFromMap] = useState(parcelFromMapInitialState);
  const addressSearchStore = useAddressSearchStore();

  // This will be used to publish events to ParcelMap
  const pubSub = usePubSub();

  const resetView = () => {
    setParcelFromMap(parcelFromMapInitialState);
    addressSearchStore.clearSearchResult();
    pubSub.publish('parcel/highlightNone');
  };

  const handleCancelButtonClick = resetView;

  const handleSaveButtonClick = () => {
    resetView();
    pubSub.publish('parcel/hazardUpdate');
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
        pubSub={pubSub}
      />

      <Card className={styles.card} style={cardStyle}>
        <CardBody id={CARD_BODY_ID}>
          <FormHeading>Fire Hazard Classification</FormHeading>
          {
            // If there is a parcel selected, show the parcel details.
            // Otherwise, show the address search form.
            parcelFromMap
              ? <ParcelDetails parcelFromMap={parcelFromMap} />
              : <AddressSearch store={addressSearchStore} />
          }
          {
          (parcelFromMap || addressSearchStore.searchResult)
            ? (
              <ClassificationForm
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

export default Classification;
