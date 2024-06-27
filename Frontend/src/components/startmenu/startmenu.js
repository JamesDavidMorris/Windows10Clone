import React, { useState, useEffect, useRef } from 'react';
import PopupMenu from '../extensions/popupmenu/popupmenu';
import StartMenuColumnSystem from './startmenucolumnsystem';
import { StartMenuColumnApplication, recentlyAddedItems } from './startmenucolumnapplication';
import StartMenuColumnTiles from './startmenucolumntiles';
import SlidingMenu from '../extensions/slidingmenu/slidingmenu';
import '../../assets/styles/components/startmenu/startmenu.css';

const StartMenu = ({ isVisible, toggleVisibility }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [clickedTile, setClickedTile] = useState(null);
  const [iconRefs, setIconRefs] = useState(null);
  const [isSlidingMenuVisible, setIsSlidingMenuVisible] = useState(false);
  const [isSlidingMenuHovered, setIsSlidingMenuHovered] = useState(false);
  const [isLeftColumnHovered, setIsLeftColumnHovered] = useState(false);

  const leftColumnRef = useRef(null);
  const slidingMenuRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (
        leftColumnRef.current.contains(e.target) ||
        (slidingMenuRef.current && slidingMenuRef.current.contains(e.target))
      ) {
        setIsSlidingMenuVisible(true);
      } else {
        setIsSlidingMenuVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleTileClick = (index) => {
    setClickedTile(index);
    setTimeout(() => {
      setClickedTile(null);
    }, 100);
  };

  const handleSlidingMenuMouseEnter = () => {
    setIsSlidingMenuHovered(true);
  };

  const handleSlidingMenuMouseLeave = () => {
    setIsSlidingMenuHovered(false);
    if (!isLeftColumnHovered) {
      setHoveredIcon(null);
    }
  };

  const handleOverlayMouseEnter = () => {
    setIsLeftColumnHovered(true);
    setHoveredIcon({ icon: '', name: '' }); // Trigger sliding menu without specific icon data
  };

  const handleOverlayMouseLeave = () => {
    setIsLeftColumnHovered(false);
    if (!isSlidingMenuHovered) {
      setHoveredIcon(null);
    }
  };

  return (
    <PopupMenu isVisible={isVisible} toggleVisibility={toggleVisibility} position={{ bottom: '40px', left: '0' }}>
      <div className="start-menu-content">
        <div
          className="left-column-overlay"
          ref={leftColumnRef}
          onMouseEnter={handleOverlayMouseEnter}
          onMouseLeave={handleOverlayMouseLeave}
        />
        <StartMenuColumnSystem setIconRefs={setIconRefs} />
        <StartMenuColumnApplication recentlyAddedItems={recentlyAddedItems} />
        <StartMenuColumnTiles handleTileClick={handleTileClick} clickedTile={clickedTile} />
        <SlidingMenu
          iconData={hoveredIcon}
          iconRefs={iconRefs}
          ref={slidingMenuRef}
          onMouseEnter={handleSlidingMenuMouseEnter}
          onMouseLeave={handleSlidingMenuMouseLeave}
          isVisible={isSlidingMenuVisible}
        />
      </div>
    </PopupMenu>
  );
};

export default StartMenu;
