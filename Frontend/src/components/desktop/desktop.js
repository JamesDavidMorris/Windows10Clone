import React, { useRef, useState, useEffect } from 'react';
import WallpaperDisplay from '../wallpaper/wallpaperdisplay';
import Taskbar from '../taskbar/taskbar';
import StartMenu from '../startmenu/startmenu';

// Contexts
import { WallpaperClickProvider } from '../../contexts/wallpaper/wallpaperclickcontext';
import { ApplicationProvider, useApplicationContext } from '../../contexts/application/applicationcontext';

const DesktopContent = ({ wallpaperRef }) => {
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);
  const { appState, ApplicationManager } = useApplicationContext();
  const [, forceUpdate] = useState();

  const toggleStartMenuVisibility = () => {
    setIsStartMenuVisible((prev) => !prev);
  };

  const openApplication = async (appName) => {
    try {
      const appComponentName = `applicationframe${appName.toLowerCase()}`;
      console.log(`Attempting to load application: ${appComponentName}`);
      const AppComponent = (await import(`../applications/${appName.toLowerCase()}/${appComponentName}`)).default;
      const appKey = `${appName.toLowerCase()}-${Date.now()}`;

      ApplicationManager.openApplication({ Component: AppComponent, key: appKey, name: appName });
      forceUpdate({});

      console.log(`Loaded application: ${appName}`);
    } catch (error) {
      console.error(`Failed to load application ${appName}:`, error);
    }
  };

  const closeApplication = (appName) => {
    ApplicationManager.closeApplication(appName);
    forceUpdate({});
    console.log(`Closed application: ${appName}`);
  };

  return (
    <div className="desktop" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={wallpaperRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
        <WallpaperDisplay />
      </div>
      <Taskbar
        isStartMenuVisible={isStartMenuVisible}
        toggleStartMenuVisibility={toggleStartMenuVisibility}
      />
      <StartMenu
        isVisible={isStartMenuVisible}
        setIsStartMenuVisible={setIsStartMenuVisible}
        openApplication={openApplication}
      />
      {appState.map(({ Component, key, name }) => (
        <Component key={key} onClose={() => closeApplication(name)} />
      ))}
    </div>
  );
};

const Desktop = () => {
  const wallpaperRef = useRef(null);
  return (
    <ApplicationProvider>
      <WallpaperClickProvider wallpaperRef={wallpaperRef}>
        <DesktopContent wallpaperRef={wallpaperRef} />
      </WallpaperClickProvider>
    </ApplicationProvider>
  );
};

export default Desktop;
