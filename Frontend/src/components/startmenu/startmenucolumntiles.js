import React from 'react';
import {
  icon_application_notepad,
  icon_application_calculator,
  icon_application_fileexplorer,
  icon_application_microsoftedge,
  icon_application_mail,
  icon_system_download,
  icon_application_microsoftstore
} from '../extensions/icons/icons';
import '../../assets/styles/components/startmenu/startmenucolumntiles.css';

const StartMenuColumnTiles = ({ handleTileClick, clickedTile }) => {
  return (
    <div className="tiles-container">
      <div className="productivity">
        <div className="productivity-header">
          <h3>Productivity</h3>
        </div>
        <div className="blank-space">
          {[
            { icon: icon_application_notepad, text: 'Notepad' },
            { icon: icon_application_calculator, text: 'Calculator' },
            { icon: icon_application_fileexplorer, text: 'File Explorer' },
            { icon: icon_application_microsoftedge, text: 'Microsoft Edge' },
            { icon: icon_application_mail, text: 'Mail' },
            { icon: icon_system_download, text: '' }
          ].map((tile, index) => (
            <div
              key={index}
              className={`tile ${clickedTile === index ? 'click-effect' : ''}`}
              onClick={() => handleTileClick(index)}
            >
              <div className="tile-content">
                <img src={tile.icon} alt={tile.text} />
                <div className="tile-text">{tile.text}</div>
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
          {[
            { icon: icon_application_microsoftstore, text: 'Microsoft Store' },
            { icon: icon_system_download, text: '' },
            { icon: icon_system_download, text: '' },
            { icon: icon_system_download, text: '' },
            { icon: icon_system_download, text: '' },
            { icon: icon_system_download, text: '' }
          ].map((tile, index) => (
            <div
              key={index + 6} // Adjust index to ensure uniqueness
              className={`tile ${clickedTile === index + 6 ? 'click-effect' : ''}`}
              onClick={() => handleTileClick(index + 6)}
            >
              <div className="tile-content">
                <img src={tile.icon} alt={tile.text} />
                <div className="tile-text">{tile.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartMenuColumnTiles;
