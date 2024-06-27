import React from 'react';
import '../../../assets/styles/components/extensions/popupmenu/popupmenu.css';

const PopupMenu = ({ isVisible, toggleVisibility, children, position }) => {
  return (
    <div className={`popup-menu ${isVisible ? 'visible' : ''}`} style={position}>
      <div className="popup-menu-content">
        {children}
      </div>
    </div>
  );
};

export default PopupMenu;