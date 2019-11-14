// @ts-check
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  Card,
  CardBody,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
} from '@patternfly/react-core';
import AddressSearch from 'components/AddressSearch';
import ParcelMap from 'components/ParcelMap';
import useAddressSearchStore from 'components/AddressSearch/useAddressSearchStore';
import FormHeading from 'components/FormHeading';
import useViewCardStyles from 'hooks/useViewCardStyles';
import usePubSub from 'hooks/usePubSub';
import useDistanceSearchStore from './components/useDistanceSearchStore';
import DistanceSearch from './components/DistanceSearch';
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
    <TextContent className={styles.parcelDetails}>
      <Text><strong>ID:</strong> {id}</Text>
      <Text><strong>APN:</strong> {apn}</Text>
      <Text><strong>Fire hazard:</strong> {isFireHazard ? 'Yes' : 'No'}</Text>
    </TextContent>
  );
};

const CancelButton = ({ onClick }) => (
  <Button
    variant={ButtonVariant.secondary}
    onClick={onClick}
  >
    Cancel
  </Button>
);

const NotifyButton = ({ onClick }) => (
  <Button
    variant={ButtonVariant.primary}
    onClick={onClick}
  >
    Notify
  </Button>
);

const SearchButton = ({ onClick }) => (
  <Button
    // TODO: make this green using PatternFly's "success" CSS color variable
    variant={ButtonVariant.primary}
    onClick={onClick}
  >
    Search
  </Button>
);

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
  const { setDistance } = distanceSearchStore;

  const resetView = useCallback(() => {
    setParcelFromMap(parcelFromMapInitialState);
    clearAddressSearch();
    clearDistanceSearch();
    setDistance('');
  }, [clearAddressSearch, clearDistanceSearch, setDistance]);

  const handleParcelClick = useCallback(
    /** @param {typeof parcelFromMap} parcel */
    parcel => {
      resetView();
      setParcelFromMap(parcel);
    }, [resetView],
  );

  /** Definitions setting state for the alert */
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const alertTimeoutIdRef = useRef();
  const hideAlert = () => setIsAlertVisible(false);
  const showAlert = () => {
    setIsAlertVisible(true);

    // Set a timeout to hide the alert, saving the timeout ID.
    // The timeout ID will be used to cancel the timeout when this component unmounts (i.e. the
    // user switches to a different view).

    // @ts-ignore // FIXME
    alertTimeoutIdRef.current = setTimeout(hideAlert, 5000);
  };

  // Clear the alert timeout when this view unmounts
  useEffect(
    () => () => { clearTimeout(alertTimeoutIdRef.current); },
    [],
  );

  const handleCancelButtonClick = () => {
    resetView();
    pubSub.publish('parcel/highlightNone');
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
          <FormHeading>Active Fire Notification</FormHeading>
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
              /** Distance search form */
              <Form onSubmit={distanceSearchStore.handleFormSubmit}>
                <DistanceSearch store={distanceSearchStore} />
                <ActionGroup className={styles.actionGroup}>
                  <CancelButton onClick={handleCancelButtonClick} />
                  {
                    distanceSearchStore.searchResults.length
                      ? <NotifyButton onClick={handleNotifyButtonClick} />
                      : <SearchButton onClick={distanceSearchStore.search} />
                  }
                </ActionGroup>
              </Form>
            )
            : <ChooseParcelText />
          }
        </CardBody>
      </Card>
    </PageSection>
  );
};

export default Notification;
