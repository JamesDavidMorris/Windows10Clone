import React, { useRef, useState } from 'react';
import WallpaperDisplay from '../wallpaper/wallpaperdisplay';
import Taskbar from '../taskbar/taskbar';
import StartMenu from '../startmenu/startmenu';

// Contexts
import { WallpaperClickProvider } from '../../contexts/wallpaper/wallpaperclickcontext';
import { ApplicationProvider } from '../../contexts/application/applicationcontext';

const DesktopContent = ({ wallpaperRef }) => {
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);
  const [openApplications, setOpenApplications] = useState([]);

  const toggleStartMenuVisibility = () => {
    setIsStartMenuVisible((prev) => !prev);
  };

  const openApplication = async (appName) => {
    try {
      const appComponentName = `applicationframe${appName.toLowerCase()}`;
      console.log(`Attempting to load application: ${appComponentName}`);
      const AppComponent = (await import(`../applications/${appName.toLowerCase()}/${appComponentName}`)).default;
      setOpenApplications((prevApps) => [
        ...prevApps,
        { Component: AppComponent, key: prevApps.length }
      ]);
      console.log(`Loaded application: ${appName}`);
    } catch (error) {
      console.error(`Failed to load application ${appName}:`, error);
    }
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
      {openApplications.map(({ Component, key }) => {
        return <Component key={key} />;
      })}
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
