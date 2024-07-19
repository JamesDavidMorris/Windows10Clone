import React, { createContext, useContext, useEffect, useState } from 'react';
import ApplicationManager from '../../managers/applicationmanager';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [appState, setAppState] = useState(ApplicationManager.getApplications());

  useEffect(() => {
    const handleStateChange = (newAppState) => {
      console.log('ApplicationContext: Application state changed:', newAppState);
      setAppState(newAppState);
    };

    ApplicationManager.addListener(handleStateChange);
    console.log('ApplicationContext: Listener added to ApplicationManager');
    return () => {
      ApplicationManager.removeListener(handleStateChange);
      console.log('ApplicationContext: Listener removed from ApplicationManager');
    };
  }, []);

  return (
    <ApplicationContext.Provider value={{ appState, ApplicationManager }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => useContext(ApplicationContext);
