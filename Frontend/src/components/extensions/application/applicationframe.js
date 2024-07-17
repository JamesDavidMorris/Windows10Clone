import React, { useState, useEffect, useRef } from 'react';
import '../../../assets/styles/components/extensions/application/applicationframe.css';

const ApplicationFrame = ({ icon, title, children, defaultWidth, defaultHeight, topBarColor, backgroundColor, backgroundImage }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [lastPosition, setLastPosition] = useState({ top: 0, left: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const frameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const centerFrame = () => {
    const topPosition = (window.innerHeight - height) / 2;
    const leftPosition = (window.innerWidth - width) / 2;
    setTop(topPosition);
    setLeft(leftPosition);
  };

  useEffect(() => {
    centerFrame();
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('.application-frame-topbar')) {
      isDraggingRef.current = true;
      setIsDragging(true);
      offset.current = {
        x: e.clientX - left,
        y: e.clientY - top,
      };
    }
  };

  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const newLeft = e.clientX - offset.current.x;
      const newTop = e.clientY - offset.current.y;
      setLeft(newLeft);
      setTop(newTop);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    if (isMaximized) {
      setWidth(defaultWidth);
      setHeight(defaultHeight);
      setTop(lastPosition.top);
      setLeft(lastPosition.left);
    } else {
      setLastPosition({ top, left });
      setTop(0);
      setLeft(0);
      setWidth(window.innerWidth);
      setHeight(window.innerHeight - 40);
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = () => {
    console.log(`${title} application closed`);
  };

  const handleDoubleClick = () => {
    handleMaximize();
  };

  const frameStyle = {
    width: isMaximized ? '100%' : width,
    height: isMaximized ? '100%' : height,
    top: isMaximized ? 0 : top,
    left: isMaximized ? 0 : left,
    backgroundColor,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    transition: isDragging ? 'none' : 'width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease',
  };

  const topBarStyle = { backgroundColor: topBarColor };
  const contentDisplayStyle = isMinimized ? { display: 'none' } : {};

  return (
    <div
      className="application-frame"
      style={frameStyle}
      ref={frameRef}
      onMouseDown={handleMouseDown}
    >
      <div
        className="application-frame-topbar"
        style={topBarStyle}
        onDoubleClick={handleDoubleClick}
      >
        <div className="application-frame-icon-title">
          {icon && <img src={icon} alt="App Icon" className="app-icon" />}
          <span className="app-title" style={!icon ? { marginLeft: '0.5rem' } : {}}>{title}</span>
        </div>
        <div className="application-frame-controls">
          <button className="control-button" onClick={handleMinimize}>_</button>
          <button className="control-button" onClick={handleMaximize}>{isMaximized ? <>&#x25A1;</> : <>&#x25A1;</>}</button>
          <button className="control-button" onClick={handleClose}>X</button>
        </div>
      </div>
      <div className="application-frame-content" style={contentDisplayStyle}>
        {children}
      </div>
    </div>
  );
};

export default ApplicationFrame;
