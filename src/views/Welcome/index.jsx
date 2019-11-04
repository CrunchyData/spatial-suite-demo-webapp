import React from 'react';
import {
  Grid,
  GridItem,
  PageSection,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { ReactComponent as Logo } from './images/hippos.svg';
import styles from './index.module.css';

const Welcome = () => (
  <PageSection>
    <Grid gutter="md">
      <GridItem span={6}>
        <Logo />
      </GridItem>
      <GridItem span={6}>
        <TextContent className={styles.pageHeader}>
          <Text>
            <strong>Welcome</strong> to the Santa Cruz County Wildfire Management Application!
          </Text>
        </TextContent>
      </GridItem>
    </Grid>
  </PageSection>
);

export default Welcome;
