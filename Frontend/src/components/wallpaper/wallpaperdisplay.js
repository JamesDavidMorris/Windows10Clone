import React from 'react';
import '../../assets/styles/components/wallpaper/wallpaperdisplay.css';
import defaultWallpaper from '../../assets/images/wallpaper/wallpaper_1.jpg';

const WallpaperDisplay = () => {
  const wallpaperStyle = {
    backgroundImage: `url(${defaultWallpaper})`,
  };

  return <div className="wallpaper" style={wallpaperStyle}></div>;
};

export default WallpaperDisplay;
