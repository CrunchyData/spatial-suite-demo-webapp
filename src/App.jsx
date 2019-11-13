import React, { useState } from 'react';
import { Page } from '@patternfly/react-core';
import Header from 'components/Header';
import WelcomeView from 'views/Welcome';
import ClassificationView from 'views/Classification';
import NotificationView from 'views/Notification';

/**
 * Returns the rendered view component for the given view ID
 * @param {string} currentViewId
 */
const renderViewById = currentViewId => {
  switch (currentViewId) {
    case 'welcome':
      return <WelcomeView />;

    case 'classification':
      return <ClassificationView />;

    case 'notification':
      return <NotificationView />;

    default:
      return `Error: No view found for id: '${currentViewId}'`;
  }
};

const App = () => {
  const [
    /** Current state (immutable) */
    currentViewId,
    /** Function to change state */
    setCurrentViewId,
  ] = useState('welcome'); // use 'welcome' for the initial state

  /** Updates the current view ID when a user chooses one in the header */
  const handleNavSelect = ({ itemId }) => {
    setCurrentViewId(itemId);
  };

  const header = (
    <Header currentViewId={currentViewId} onNavSelect={handleNavSelect} />
  );

  return (
    <Page header={header}>
      {renderViewById(currentViewId)}
    </Page>
  );
};

export default App;
