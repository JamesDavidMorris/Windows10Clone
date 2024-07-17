import React, { useState, useEffect, useRef } from 'react';
import PopupMenu from '../extensions/popupmenu/popupmenu';
import StartMenuColumnSystem from './startmenucolumnsystem';
import { StartMenuColumnApplication, recentlyAddedItems } from './startmenucolumnapplication';
import StartMenuColumnTiles from './startmenucolumntiles';
import SlidingMenu from '../extensions/slidingmenu/slidingmenu';
import Taskbar from '../taskbar/taskbar';
import '../../assets/styles/components/startmenu/startmenu.css';

// Context
import { useWallpaperClickListener } from '../../contexts/wallpaper/wallpaperclickcontext';

const StartMenu = ({ isVisible, setIsStartMenuVisible, openApplication }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null); // State to manage the hovered icon
  const [clickedTile, setClickedTile] = useState(null); // State to manage the clicked tile
  const [iconRefs, setIconRefs] = useState(null); // State to store references to icons
  const [isSlidingMenuVisible, setIsSlidingMenuVisible] = useState(false); // State to manage the visibility of the sliding menu
  const [isSlidingMenuHovered, setIsSlidingMenuHovered] = useState(false); // State to manage the hover state of the sliding menu
  const [isLeftColumnHovered, setIsLeftColumnHovered] = useState(false); // State to manage the hover state of the left column

  const leftColumnRef = useRef(null); // Reference for the left column
  const slidingMenuRef = useRef(null); // Reference for the sliding menu
  const recentlyAddedRef = useRef(null); // Reference for the recently added section

  // Effect to handle mouse movements for showing/hiding the sliding menu
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

  // Scroll the second column pane to the top
  const scrollToTop = () => {
    if (recentlyAddedRef.current) {
      recentlyAddedRef.current.scrollTop = 0;
    }
  };

  // Toggle the start menu visibility
  const toggleStartMenuVisibility = () => {
    if (isVisible) {
      scrollToTop(); // Scroll to top before hiding the start menu
      setIsStartMenuVisible(false);
    } else {
      setIsStartMenuVisible(true);
    }
  };

  // Handle tile click event
  const handleTileClick = (index) => {
    setClickedTile(index);
    setTimeout(() => {
      setClickedTile(null);
    }, 100);
  };

  // Handle mouse enter event on the sliding menu
  const handleSlidingMenuMouseEnter = () => {
    setIsSlidingMenuHovered(true);
  };

  // Handle mouse leave event on the sliding menu
  const handleSlidingMenuMouseLeave = () => {
    setIsSlidingMenuHovered(false);
    if (!isLeftColumnHovered) {
      setHoveredIcon(null);
    }
  };

  // Handle mouse enter event on the left column mouse interaction area
  const handleOverlayMouseEnter = () => {
    setIsLeftColumnHovered(true);
    setHoveredIcon({ icon: '', name: '' }); // Trigger sliding menu without specific icon data
  };

  // Handle mouse leave event on the left column mouse interaction area
  const handleOverlayMouseLeave = () => {
    setIsLeftColumnHovered(false);
    if (!isSlidingMenuHovered) {
      setHoveredIcon(null);
    }
  };

  // Close the start menu when clicking on the wallpaper
  useWallpaperClickListener(() => {
    scrollToTop(); // Scroll to top before closing via wallpaper click
    setIsStartMenuVisible(false);
  });

  // Handle click events on the sliding menu buttons
  const handleSlidingMenuClick = (key) => {
    if (key === 'start') {
      setIsSlidingMenuVisible(false);
    }
  };

  return (
    <>
      <PopupMenu isVisible={isVisible} toggleVisibility={toggleStartMenuVisibility} position={{ bottom: '40px', left: '0' }}>
        <div className="start-menu-content">
          <div
            className="left-column-overlay"
            ref={leftColumnRef}
            onMouseEnter={handleOverlayMouseEnter}
            onMouseLeave={handleOverlayMouseLeave}
          />
          <StartMenuColumnSystem setIconRefs={setIconRefs} />
          <StartMenuColumnApplication recentlyAddedItems={recentlyAddedItems} recentlyAddedRef={recentlyAddedRef} openApplication={openApplication} />
          <StartMenuColumnTiles handleTileClick={handleTileClick} clickedTile={clickedTile} />
          <SlidingMenu
            iconData={hoveredIcon}
            iconRefs={iconRefs}
            ref={slidingMenuRef}
            onMouseEnter={handleSlidingMenuMouseEnter}
            onMouseLeave={handleSlidingMenuMouseLeave}
            isVisible={isSlidingMenuVisible}
            setIsVisible={setIsSlidingMenuVisible}
          />
        </div>
      </PopupMenu>
      <Taskbar isStartMenuVisible={isVisible} toggleStartMenuVisibility={toggleStartMenuVisibility} scrollToTop={scrollToTop} />
    </>
  );
};

export default StartMenu;
