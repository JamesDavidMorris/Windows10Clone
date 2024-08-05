import React, { useRef, useState } from 'react';
import WallpaperDisplay from '../wallpaper/wallpaperdisplay';
import Taskbar from '../taskbar/taskbar';
import StartMenu from '../startmenu/startmenu';

// Contexts
import { WallpaperClickProvider } from '../../contexts/wallpaper/wallpaperclickcontext';
import { ApplicationProvider, useApplicationContext } from '../../contexts/application/applicationcontext';

const DesktopContent = ({ wallpaperRef }) => {
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);
  const { appState, ApplicationManager, openApplication } = useApplicationContext();
  const [, forceUpdate] = useState();

  const toggleStartMenuVisibility = () => {
    setIsStartMenuVisible((prev) => !prev);
  };

  const closeApplication = (appKey) => {
    ApplicationManager.closeApplication(appKey);
    forceUpdate({});
    console.log(`Closed application: ${appKey}`);
  };

  const focusApplication = (appKey) => {
    ApplicationManager.focusApplication(appKey);
    console.log(`Focusing application: ${appKey}`);
  };

  const handleDesktopClick = () => {
    ApplicationManager.unfocusApplication();
    console.log('Unfocused all applications');
  };

  return (
    <div className="desktop" style={{ position: 'relative', width: '100%', height: '100%' }} onClick={handleDesktopClick}>
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
      />
      {appState.map(({ Component, key, name }) => (
        <Component key={key} appKey={key} onClose={() => closeApplication(key)} onClick={(e) => { e.stopPropagation(); focusApplication(key); }} />
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
