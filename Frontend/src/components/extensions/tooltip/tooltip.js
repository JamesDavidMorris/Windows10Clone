import React from 'react';
import '../../../assets/styles/components/extensions/tooltip/tooltip.css';

const Tooltip = ({ text, visible, position, isClock }) => {
  if (!visible) return null;

  const tooltipStyle = isClock
    ? { top: position.top - 20, right: 0, transform: position.top - 20  }
    : { top: position.top - 20, left: position.left, transform: position.top - 20 };

  return (
    <div className="tooltip" style={tooltipStyle}>
      {text}
    </div>
  );
};

export default Tooltip;