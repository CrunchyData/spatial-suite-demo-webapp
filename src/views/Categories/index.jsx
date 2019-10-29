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
import EditForm from './components/EditForm';
import styles from './index.module.css';

/** @typedef {import('api').Parcel} Parcel */

/** @type {Parcel | null} */
const selectedParcelInitialState = null;

const ChooseParcelText = () => (
  <TextContent>
    <Text>Please choose a parcel.</Text>
  </TextContent>
);

const Categories = () => {
  const [selectedParcel, setSelectedParcel] = useState(selectedParcelInitialState);

  const handleCancelButtonClick = () => {
    // Deselect the parcel
    setSelectedParcel(selectedParcelInitialState);
  };

  const handleSaveButtonClick = parcel => {
    // TODO: Send parcel updates to backend
    setSelectedParcel(parcel);
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <ViewHeading>
          fire risk category editor and viewer
        </ViewHeading>
      </PageSection>

      <PageSection variant={PageSectionVariants.light}>
        {/* <ViewHeading>fire risk category editor and viewer</ViewHeading> */}

        <Grid gutter="md" className={styles.pageContentContainer}>
          <GridItem span={6}>
            <MapSearch onSelectParcel={setSelectedParcel} />
          </GridItem>

          <GridItem span={6}>
            <Bullseye>
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
            </Bullseye>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default Categories;
