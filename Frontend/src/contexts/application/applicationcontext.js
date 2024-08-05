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

  const openApplication = async (appName) => {
    try {
      const appComponentName = `applicationframe${appName.toLowerCase()}`;
      const importPath = `../../components/applications/${appName.toLowerCase()}/${appComponentName}.js`;
      console.log(`Attempting to load application from path: ${importPath}`);

      const AppComponent = (await import(
        /* webpackMode: "lazy" */
        `../../components/applications/${appName.toLowerCase()}/${appComponentName}`
      )).default;

      if (!AppComponent) {
        throw new Error(`Failed to load component for application: ${appName}`);
      }

      const appKey = `${appName.toLowerCase()}-${Date.now()}`;
      const { icon, title } = AppComponent.defaultProps;
      ApplicationManager.openApplication({ Component: AppComponent, key: appKey, name: appName, icon, title });

      console.log(`Loaded application: ${appName}`);
    } catch (error) {
      console.error(`Failed to load application ${appName}:`, error);
    }
  };

  return (
    <ApplicationContext.Provider value={{ appState, ApplicationManager, openApplication }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => useContext(ApplicationContext);
