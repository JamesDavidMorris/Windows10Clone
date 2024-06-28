import React, { useRef, useState } from 'react';
import WallpaperDisplay from '../wallpaper/wallpaperdisplay';
import Taskbar from '../taskbar/taskbar';
import StartMenu from '../startmenu/startmenu';

// Contexts
import { WallpaperClickProvider } from '../../contexts/wallpaper/wallpaperclickcontext';

const DesktopContent = ({ wallpaperRef }) => {
  const [isStartMenuVisible, setIsStartMenuVisible] = useState(false);

  const toggleStartMenuVisibility = () => {
    setIsStartMenuVisible((prev) => !prev);
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
      />
    </div>
  );
};

const Desktop = () => {
  const wallpaperRef = useRef(null);
  return (
    <WallpaperClickProvider wallpaperRef={wallpaperRef}>
      <DesktopContent wallpaperRef={wallpaperRef} />
    </WallpaperClickProvider>
  );
};

export default Desktop;
