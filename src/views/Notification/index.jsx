// @ts-check
import React, { useCallback, useState } from 'react';
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
import usePubSub from 'hooks/usePubSub';
import useDistanceSearchStore from './components/useDistanceSearchStore';
import NotificationForm from './components/NotificationForm';
import NotificationAlert from './components/NotificationAlert';
import styles from './index.module.css';

/** @typedef {import('api').ParcelCoords} ParcelCoords */
/** @typedef {import('components/ParcelMap/CrunchyMap').ParcelFromMap} ParcelFromMap */

// IDs for dynamically resizing the card
const VIEW_CONTAINER_ID = 'notificationView';
const CARD_BODY_ID = 'notificationCardBody';

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

const Notification = () => {
  const [parcelFromMap, setParcelFromMap] = useState(parcelFromMapInitialState);
  const addressSearchStore = useAddressSearchStore();
  const parcelId = (
    (addressSearchStore.searchResult && addressSearchStore.searchResult.parcelid)
    || (parcelFromMap && parcelFromMap.id)
  );
  const distanceSearchStore = useDistanceSearchStore(parcelId);

  // This will be used to publish events to ParcelMap
  const pubSub = usePubSub();

  // Sometimes references to stores can change while references to their actions stay the same.
  // Since there are callbacks below that depend on these actions, we'll reference the actions
  // to reduce unnecessary re-renders.
  const clearAddressSearch = addressSearchStore.clearSearchResult;
  const clearDistanceSearch = distanceSearchStore.clearSearchResults;

  const resetView = useCallback(() => {
    setParcelFromMap(parcelFromMapInitialState);
    clearAddressSearch();
    clearDistanceSearch();
    pubSub.publish('parcel/highlightNone');
  }, [clearAddressSearch, clearDistanceSearch, pubSub]);

  const handleParcelClick = useCallback(
    /** @param {typeof parcelFromMap} parcel */
    parcel => {
      resetView();
      setParcelFromMap(parcel);
    }, [resetView],
  );

  /** Definitions setting state for the alert */
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showAlert = () => setIsAlertVisible(true);
  const hideAlert = () => setIsAlertVisible(false);

  const handleCancelButtonClick = () => {
    resetView();
  };

  const handleNotifyButtonClick = event => {
    event.preventDefault(); // Prevent the browser from refreshing
    showAlert();
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
        onParcelClick={handleParcelClick}
        surroundingParcels={distanceSearchStore.searchResults}
        pubSub={pubSub}
      />

      {isAlertVisible && (
        <NotificationAlert onClose={hideAlert} />
      )}

      <Card className={styles.card} style={cardStyle}>
        <CardBody id={CARD_BODY_ID}>
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
              <NotificationForm
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

export default Notification;
