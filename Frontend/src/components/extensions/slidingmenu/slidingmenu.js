import React, { useEffect, useState, forwardRef } from 'react';
import '../../../assets/styles/components/extensions/slidingmenu/slidingmenu.css';

// Calculate the offset position of an element
function getOffset(el) {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

const SlidingMenu = forwardRef(({ iconData, iconRefs, onMouseEnter, onMouseLeave, isVisible, setIsVisible }, ref) => {
  const [positions, setPositions] = useState({});
  const [isTransitioned, setIsTransitioned] = useState(false);
  const [slidingWindowWidth, setSlidingWindowWidth] = useState(0);
  const [hoveredKey, setHoveredKey] = useState(null);

  // Retrieve the icon positions after a delay to ensure the elements are fully rendered
  useEffect(() => {
    if (isVisible && iconRefs) {
      const timer = setTimeout(() => {
        const positions = {
          start: getOffset(iconRefs.burger),
          user: getOffset(iconRefs.profile),
          documents: getOffset(iconRefs.documents),
          pictures: getOffset(iconRefs.pictures),
          settings: getOffset(iconRefs.settings),
          power: getOffset(iconRefs.power),
        };
        setPositions(positions);
      }, 10); // Delay to ensure elements are rendered
      return () => clearTimeout(timer); // Clear timeout on cleanup
    }
  }, [isVisible, iconRefs]);

  // Set the width of the sliding window
  useEffect(() => {
    if (ref.current) {
      setSlidingWindowWidth(ref.current.offsetWidth);
    }
  }, [ref, isVisible]);

  // Get the display text for each icon
  const getTextForIcon = (name) => {
    switch (name) {
      case 'START':
        return 'START';
      case 'Profile':
        return 'User';
      case 'Documents':
        return 'Documents';
      case 'Pictures':
        return 'Pictures';
      case 'Settings':
        return 'Settings';
      case 'Power':
        return 'Power';
      default:
        return '';
    }
  };

  // Calculate the top position of the text relative to the start icon
  const renderTextPosition = (key) => {
    if (positions[key] && positions.start) {
      const offsetTop = positions[key].top - positions.start.top;
      return `${offsetTop}px`;
    }
    return '0';
  };

  // Handle the end of the transition
  const handleTransitionEnd = () => {
    setIsTransitioned(true);
  };

  // Handle hover background mouse enter
  const handleHoverBackgroundMouseEnter = (key) => {
    setHoveredKey(key);
    onMouseEnter();
  };

  // Handle hover background mouse leave
  const handleHoverBackgroundMouseLeave = () => {
    setHoveredKey(null);
    onMouseLeave();
  };

  // Handle hover background click
  const handleHoverBackgroundClick = (key) => {
    if (key === 'START') {
      setIsVisible(false); // Directly set the visibility state to false
    }
  };

  return (
    <div
      className={`sliding-window ${isVisible ? 'show' : ''}`}
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="sliding-window-content">
        {/* Render hover background divs for each icon */}
        {['START', 'user', 'documents', 'pictures', 'settings', 'power'].map((key) => (
          <div
            key={key}
            className={`hover-background ${key} ${hoveredKey === key ? 'hovered' : ''}`}
            style={{ top: renderTextPosition(key), width: `${slidingWindowWidth}px` }}
            onMouseEnter={() => handleHoverBackgroundMouseEnter(key)}
            onMouseLeave={handleHoverBackgroundMouseLeave}
            onClick={() => handleHoverBackgroundClick(key)}
          />
        ))}

        {/* Render text for each icon */}
        <p className="start" style={{ top: renderTextPosition('start') }}>
          {getTextForIcon('START')}
        </p>
        <p className="user" style={{ top: renderTextPosition('user') }}>
          {getTextForIcon('Profile')}
        </p>
        <p className="documents" style={{ top: renderTextPosition('documents') }}>
          {getTextForIcon('Documents')}
        </p>
        <p className="pictures" style={{ top: renderTextPosition('pictures') }}>
          {getTextForIcon('Pictures')}
        </p>
        <p className="settings" style={{ top: renderTextPosition('settings') }}>
          {getTextForIcon('Settings')}
        </p>
        <p className="power" style={{ top: renderTextPosition('power') }}>
          {getTextForIcon('Power')}
        </p>
      </div>
    </div>
  );
});

export default SlidingMenu;
