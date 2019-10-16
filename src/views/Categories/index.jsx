import React, { useState } from 'react';
import {
  Grid,
  GridItem,
  PageSection,
  Bullseye,
} from '@patternfly/react-core';
import ViewHeading from 'components/ViewHeading';
import MapSearch from 'components/MapSearch';
import EditForm from './components/EditForm';

const selectedParcelInitialState = '';

const Categories = () => {
  const [selectedParcel, setSelectedParcel] = useState(selectedParcelInitialState);

  const handleCancelButtonClick = () => {
    setSelectedParcel(selectedParcelInitialState);
  };

  return (
    <>
      <PageSection>
        <ViewHeading>fire risk category editor and viewer</ViewHeading>
      </PageSection>

      <PageSection>
        <Grid gutter="md">
          <GridItem span={4}>
            <MapSearch onSelectParcel={setSelectedParcel} />
          </GridItem>

          <GridItem span={8}>
            <Bullseye>
              {
                selectedParcel
                  ? <EditForm onCancelButtonClick={handleCancelButtonClick} />
                  : 'Please choose a parcel'
              }
            </Bullseye>

          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default Categories;
