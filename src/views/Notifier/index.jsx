import React, { useState } from 'react';
import {
  Bullseye,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
} from '@patternfly/react-core';
import ViewHeading from 'components/ViewHeading';
import MapSearch from 'components/MapSearch';
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

  const handleCancelButtonClick = () => {
    // Deselect the parcel
    setSelectedParcel(selectedParcelInitialState);
  };

  const handleNotifyButtonClick = parcel => {
    // TODO: Send notification about selected parcels to backend
    setSelectedParcel(parcel);
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <ViewHeading>
          fire notifier
        </ViewHeading>
      </PageSection>

      <PageSection variant={PageSectionVariants.light}>
        <Grid gutter="md" className={styles.pageContentContainer}>
          <GridItem span={6}>
            <MapSearch onSelectParcel={setSelectedParcel} />
          </GridItem>

          <GridItem span={6}>
            <Bullseye>
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
            </Bullseye>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default Notifier;
