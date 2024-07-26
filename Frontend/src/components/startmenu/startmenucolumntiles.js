import React from 'react';
import {
  icon_application_calendar,
  icon_application_calculator,
  icon_application_fileexplorer,
  icon_application_microsoftedge,
  icon_application_mail,
  icon_system_download,
  icon_application_microsoftstore
} from '../extensions/icons/icons';
import '../../assets/styles/components/startmenu/startmenucolumntiles.css';

const StartMenuColumnTiles = ({ handleTileClick, clickedTile, openApplication, setIsStartMenuVisible }) => {
  const handleAppClick = (appName, index) => {
    handleTileClick(index);
    setTimeout(() => {
      setIsStartMenuVisible(false);
      if (appName) {
        openApplication(appName);
      }
    }, 300);
  };

  const productivityTiles = [
    { name: 'Calendar', icon: icon_application_calendar },
    { name: 'Calculator', icon: icon_application_calculator },
    { name: 'File Explorer', icon: icon_application_fileexplorer },
    { name: 'Microsoft Edge', icon: icon_application_microsoftedge },
    { name: 'Mail', icon: icon_application_mail },
    { name: '', icon: icon_system_download }
  ];

  const exploreTiles = [
    { name: 'Microsoft Store', icon: icon_application_microsoftstore },
    { name: '', icon: icon_system_download },
    { name: '', icon: icon_system_download },
    { name: '', icon: icon_system_download },
    { name: '', icon: icon_system_download },
    { name: '', icon: icon_system_download }
  ];

  return (
    <div className="tiles-container">
      <div className="productivity">
        <div className="productivity-header">
          <h3>Productivity</h3>
        </div>
        <div className="blank-space">
          {productivityTiles.map((tile, index) => (
            <div
              key={index}
              className={`tile ${clickedTile === index ? 'click-effect' : ''}`}
              onClick={() => handleAppClick(tile.name, index)}
            >
              <div className="tile-content">
                <img src={tile.icon} alt={tile.name} />
                <div className="tile-text">{tile.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="explore">
        <div className="explore-header">
          <h3>Explore</h3>
        </div>
        <div className="blank-space">
          {exploreTiles.map((tile, index) => (
            <div
              key={index + productivityTiles.length} // Adjust index to ensure uniqueness
              className={`tile ${clickedTile === index + productivityTiles.length ? 'click-effect' : ''}`}
              onClick={() => handleTileClick(index + productivityTiles.length)}
            >
              <div className="tile-content">
                <img src={tile.icon} alt={tile.name} />
                <div className="tile-text">{tile.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartMenuColumnTiles;
