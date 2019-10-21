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

const selectedParcelInitialState = '';

const ChooseParcelText = () => (
  <TextContent>
    <Text>Please choose a parcel.</Text>
  </TextContent>
);

const Categories = () => {
  const [selectedParcel, setSelectedParcel] = useState(selectedParcelInitialState);

  const handleCancelButtonClick = () => {
    setSelectedParcel(selectedParcelInitialState);
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <ViewHeading>fire risk category editor and viewer</ViewHeading>

        <Grid gutter="md">
          <GridItem span={4}>
            <MapSearch onSelectParcel={setSelectedParcel} />
          </GridItem>

          <GridItem span={8}>
            <Bullseye>
              {
                selectedParcel
                  ? <EditForm onCancelButtonClick={handleCancelButtonClick} />
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
