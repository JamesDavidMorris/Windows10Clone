import React from 'react';
import '../../assets/styles/components/wallpaper/wallpaperdisplay.css';
import defaultWallpaper from '../../assets/images/wallpaper/wallpaper_1.jpg';

const WallpaperDisplay = () => {
  const wallpaperStyle = {
    backgroundImage: `url(${defaultWallpaper})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1,
  };

  return <div style={wallpaperStyle}></div>;
};

export default WallpaperDisplay;