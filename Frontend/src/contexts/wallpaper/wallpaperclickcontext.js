import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const WallpaperClickContext = createContext();

export const WallpaperClickProvider = ({ children, wallpaperRef }) => {
  const [listeners, setListeners] = useState([]);

  const registerListener = useCallback((listener) => {
    setListeners((prevListeners) => [...prevListeners, listener]);
  }, []);

  const unregisterListener = useCallback((listener) => {
    setListeners((prevListeners) => prevListeners.filter((l) => l !== listener));
  }, []);

  const handleClick = useCallback((event) => {
    if (wallpaperRef.current && wallpaperRef.current.contains(event.target)) {
      listeners.forEach((listener) => listener());
    }
  }, [listeners, wallpaperRef]);

  useEffect(() => {
    const currentWallpaperRef = wallpaperRef.current;
    if (currentWallpaperRef) {
      currentWallpaperRef.addEventListener('click', handleClick);
    }
    return () => {
      if (currentWallpaperRef) {
        currentWallpaperRef.removeEventListener('click', handleClick);
      }
    };
  }, [handleClick, wallpaperRef]);

  return (
    <WallpaperClickContext.Provider value={{ registerListener, unregisterListener }}>
      {children}
    </WallpaperClickContext.Provider>
  );
};

export const useWallpaperClick = () => {
  const context = useContext(WallpaperClickContext);
  if (!context) {
    throw new Error('useWallpaperClick must be used within a WallpaperClickProvider');
  }
  return context;
};

export const useWallpaperClickListener = (listener) => {
  const { registerListener, unregisterListener } = useWallpaperClick();
  const listenerRef = React.useRef(listener);

  useEffect(() => {
    listenerRef.current = listener;
  }, [listener]);

  useEffect(() => {
    registerListener(listenerRef.current);
    return () => unregisterListener(listenerRef.current);
  }, [registerListener, unregisterListener]);
};
