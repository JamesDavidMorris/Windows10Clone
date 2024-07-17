import React, { createContext, useState, useContext } from 'react';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [appState, setAppState] = useState({});

  return (
    <ApplicationContext.Provider value={{ appState, setAppState }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplicationContext = () => useContext(ApplicationContext);