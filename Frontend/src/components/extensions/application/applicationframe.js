import React, { useState, useEffect, useRef } from 'react';
import '../../../assets/styles/components/extensions/application/applicationframe.css';

// Manager
import ApplicationManager from '../../../managers/applicationmanager';

// Import icons
import {
  icon_system_application_minimize,
  icon_system_application_maximize,
  icon_system_application_close
} from '../../extensions/icons/icons';

const ApplicationFrame = ({
  appKey,
  icon,
  title,
  children,
  defaultWidth,
  defaultHeight,
  topBarColor,
  backgroundColor,
  backgroundImage,
  minimizeButtonColor = '#0077d7',
  maximizeButtonColor = '#0077d7',
  closeButtonColor = '#d70022',
  onClose
}) => {

  const frameRef = useRef(null);
  const [, forceUpdate] = useState();

  const calculateCenterPosition = () => {
    const topPosition = (window.innerHeight - defaultHeight) / 2;
    const leftPosition = (window.innerWidth - defaultWidth) / 2;
    return { top: topPosition, left: leftPosition };
  };

  const initialPosition = calculateCenterPosition();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);
  const [top, setTop] = useState(initialPosition.top);
  const [left, setLeft] = useState(initialPosition.left);
  const [lastPosition, setLastPosition] = useState({ top: initialPosition.top, left: initialPosition.left });
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [taskbarPosition, setTaskbarPosition] = useState(ApplicationManager.getTaskbarPosition(appKey));

  const isDraggingRef = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Mouse down event for dragging the application frame
  const handleMouseDown = (e) => {
    if (e.target.closest('.application-frame-topbar')) {
      isDraggingRef.current = true;
      setIsDragging(true);
      offset.current = {
        x: e.clientX - left,
        y: e.clientY - top,
      };
    }
    handleFocus();
  };

  // Mouse move event for dragging the application frame
  const handleMouseMove = (e) => {
    if (isDraggingRef.current) {
      const newLeft = e.clientX - offset.current.x;
      const newTop = e.clientY - offset.current.y;
      setLeft(newLeft);
      setTop(newTop);
    }
  };

  // Mouse up event to stop dragging the application frame
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

  // Convert taskbar button position to application frame position
  const calculateRelativeTaskbarPosition = () => {
    const taskbarPos = ApplicationManager.getTaskbarPosition(appKey);
    const frameRect = frameRef.current.getBoundingClientRect();

    // Calculate the center of the application frame
    const frameCenterTop = frameRect.height / 2;
    const frameCenterLeft = frameRect.width / 2;

    return {
      top: taskbarPos.top - frameCenterTop,
      left: taskbarPos.left - frameCenterLeft
    };
  };

  // Handles the minimize button click
  const handleMinimize = () => {
    // Minimize the center of the application to its taskbar button
    const taskbarPos = calculateRelativeTaskbarPosition();
    setTaskbarPosition(taskbarPos);

    setIsTransitioning(true);
    setIsMinimized(true);
    setTimeout(() => {
      ApplicationManager.minimizeApplication(appKey);
      setIsTransitioning(false);
    }, 300); // Wait for the transition to complete
  };

  // Handles the taskbar button click when minimized
  const handleRestore = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsMinimized(false);
      setIsTransitioning(false);
    }, 0); // Wait for the transition to complete
  };


  // Handles the maximize button click and manages the transition state
  const handleMaximize = () => {
    setIsTransitioning(true);
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

  // Resets the transition state after the maximize/unmaximize animation ends to re-enable button interactions
  useEffect(() => {
    const handleTransitionEnd = () => {
      setIsTransitioning(false);
    };

    const frameElement = frameRef.current;
    frameElement.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      frameElement.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, [frameRef]);

  // Handles the close button click
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Handles double click on the top bar to maximize/unmaximize the application
  const handleDoubleClick = () => {
    handleMaximize();
  };

  const frameStyle = {
    display: isMinimized && !isTransitioning ? 'none' : 'block',
    opacity: isMinimized ? 0 : 1,
    width: isMaximized ? '100%' : width,
    height: isMaximized ? '100%' : height,
    top: isMaximized ? 0 : top,
    left: isMaximized ? 0 : left,
    transform: isMinimized
      ? `translate(${taskbarPosition.left - left}px, ${taskbarPosition.top - top}px) scale(0.3)`
      : 'translate(0, 0) scale(1)',
    backgroundColor,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    transition: isDragging ? 'none' : 'opacity 0.3s ease, transform 0.3s ease, width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease',
    zIndex: ApplicationManager.getZIndex(appKey)
  };

  const topBarStyle = { backgroundColor: topBarColor };
  const contentDisplayStyle = isMinimized ? { display: 'none' } : {};

  // Application focus
  const handleFocus = () => {
    // Ensure the application is still open before focusing on it
    if (ApplicationManager.getApplications().find(app => app.key === appKey)) {
      ApplicationManager.focusApplication(appKey);
      forceUpdate({});
    }
  };

  useEffect(() => {
    const handleFocusChange = (focusedAppStack) => {
      setIsFocused(focusedAppStack[0] === appKey);
      forceUpdate({});
    };

    const handleRestoreMinimized = (key) => {
      if (key === appKey) {
        handleRestore();
      }
    };

    ApplicationManager.addFocusListener(handleFocusChange);
    ApplicationManager.addRestoreListener(handleRestoreMinimized);

    return () => {
      ApplicationManager.removeFocusListener(handleFocusChange);
      ApplicationManager.removeRestoreListener(handleRestoreMinimized);
    };
  }, [appKey]);

  return (
    <div
      className={`application-frame ${isFocused ? 'focused' : ''} ${isMinimized ? 'minimized' : ''}`}
      style={frameStyle}
      ref={frameRef}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="application-frame-topbar"
        style={topBarStyle}
        onDoubleClick={handleDoubleClick}
      >
        <div className="application-frame-icon-title">
          <span className="app-title">{title}</span>
        </div>
        <div className={`application-frame-controls ${isTransitioning ? 'control-button-disabled' : ''}`}>
          <div
            className="control-button-column minimize"
            onClick={handleMinimize}
            style={{ '--hover-color': minimizeButtonColor }}
          >
            <img src={icon_system_application_minimize} alt="Minimize" />
          </div>
          <div
            className="control-button-column maximize"
            onClick={handleMaximize}
            style={{ '--hover-color': maximizeButtonColor }}
          >
            <img src={icon_system_application_maximize} alt="Maximize" />
          </div>
          <div
            className="control-button-column close"
            onClick={handleClose}
            style={{ '--hover-color': closeButtonColor }}
          >
            <img src={icon_system_application_close} alt="Close" />
          </div>
        </div>
      </div>
      <div className="application-frame-content" style={contentDisplayStyle}>
        {children}
      </div>
    </div>
  );
};

export default ApplicationFrame;
