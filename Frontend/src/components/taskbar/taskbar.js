import React, { useEffect, useState, useRef } from 'react';
import Tooltip from '../extensions/tooltip/tooltip';
import TaskbarCalendar from './calendar/taskbarcalendar';

import '../../assets/styles/components/taskbar/taskbar.css';
import '../../assets/styles/components/extensions/tooltip/tooltip.css';

// Context
import { useApplicationContext } from '../../contexts/application/applicationcontext';

// Manager
import ApplicationManager from '../../managers/applicationmanager';

// Icons
import {
  icon_system_sound_max,
  icon_system_network_notconnected,
  icon_system_tray_open
} from '../extensions/icons/icons';

const ICON_TASKBAR_START_LOGO = '/assets/images/icons/taskbar/start/icon_taskbar_start_logo_1.svg';

const Taskbar = ({ isStartMenuVisible, toggleStartMenuVisibility, scrollToTop, openApplication }) => {
  /* Start */
  const [svgContent, setSvgContent] = useState('');

  /* Tooltip */
  const [tooltip, setTooltip] = useState({ visible: false, text: '', position: { top: 0, left: 0 }, isClock: false });
  const tooltipTimeoutRef = useRef(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  /* Clock */
  const [time, setTime] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  /* Applications */
  const { appState } = useApplicationContext();
  const [focusedApp, setFocusedApp] = useState(ApplicationManager.getFocusedApplication());
  const [, forceUpdate] = useState();

  /* Start */
  useEffect(() => {
    // Fetch the SVG content for the start button logo
    const fetchSVG = async () => {
      try {
        const response = await fetch(ICON_TASKBAR_START_LOGO);
        const text = await response.text();
        setSvgContent(text);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };
    fetchSVG();
  }, []);

  // Handle the start button click to toggle the start menu visibility
  const handleStartButtonClick = () => {
    if (isStartMenuVisible) {
      scrollToTop(); // Scroll to top before hiding the start menu
    }
    toggleStartMenuVisibility();
    setTooltip({ visible: false, text: '', position: { top: 0, left: 0 }, isClock: false }); // Hide the tooltip
  };

  /* Tooltip */
  // Update mouse position on mouse move
  const handleMouseMove = (e) => {
    mousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  // Show tooltip after 500ms
  const handleMouseEnter = (e, text, isClock = false) => {
    document.addEventListener('mousemove', handleMouseMove);
    tooltipTimeoutRef.current = setTimeout(() => {
      const { x, y } = mousePositionRef.current;
      setTooltip({
        visible: true,
        text,
        position: {
          top: y,
          left: x,
        },
        isClock
      });
    }, 500);
  };

  // Hide tooltip
  const handleMouseLeave = () => {
    clearTimeout(tooltipTimeoutRef.current);
    setTooltip({ visible: false, text: '', position: { top: 0, left: 0 }, isClock: false });
    document.removeEventListener('mousemove', handleMouseMove);
  };

  /* Clock */
  // Update the clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format the time for display on the taskbar
  const formatTime = (date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  // Format the date for display on the taskbar
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get the full date in text format
  const getFullDateText = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Toggle calendar visibility
  const toggleCalendarVisibility = () => {
    setIsCalendarVisible((prev) => !prev);
  };

  /* Applications */
  // Application focus
  useEffect(() => {
    const handleFocusChange = (focusedAppStack) => {
      setFocusedApp(focusedAppStack[0] || null);
    };

    ApplicationManager.addFocusListener(handleFocusChange);
    return () => {
      ApplicationManager.removeFocusListener(handleFocusChange);
    };
  }, []);

  const handleFocusApplication = (appKey) => {
    console.log('Taskbar button clicked for app:', appKey);
    ApplicationManager.focusApplication(appKey);
    forceUpdate({});
  };

  return (
    <div className="taskbar">
      <Tooltip text={tooltip.text} visible={tooltip.visible} position={tooltip.position} isClock={tooltip.isClock} />
      {isCalendarVisible && <TaskbarCalendar setIsCalendarVisible={setIsCalendarVisible} openApplication={openApplication} />}

      <div className="taskbar-left">
        <div
          className="start-button-background"
          onClick={handleStartButtonClick}
        >
          <button className="start-button">
            <div dangerouslySetInnerHTML={{ __html: svgContent }} className="start-logo" />
          </button>
        </div>
        {appState.map((app) => (
          <button
            key={app.key}
            className={`taskbar-app-button ${focusedApp === app.key ? 'focused' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Taskbar button clicked for app:', app.key);
              handleFocusApplication(app.key);
            }}
          >
            <img src={app.icon} className="taskbar-app-icon" />
          </button>
        ))}
      </div>
      <div className="taskbar-right">
        <div className="system-tray">
          <div
            className="system-icon-background"
            onMouseEnter={(e) => handleMouseEnter(e, 'Show hidden icons')}
            onMouseLeave={handleMouseLeave}
          >
            <img src={icon_system_tray_open} alt="Show hidden icons" className="system-icon" />
          </div>
          <div
            className="system-icon-background"
            onMouseEnter={(e) => handleMouseEnter(e, 'No internet access')}
            onMouseLeave={handleMouseLeave}
          >
            <img src={icon_system_network_notconnected} alt="Internet Access" className="system-icon" />
          </div>
          <div
            className="system-icon-background"
            onMouseEnter={(e) => handleMouseEnter(e, 'Sound')}
            onMouseLeave={handleMouseLeave}
          >
            <img src={icon_system_sound_max} alt="Sound" className="system-icon" />
          </div>
        </div>
        <div
          className="clock-background"
          onMouseEnter={(e) => handleMouseEnter(e, getFullDateText(time), true)}
          onMouseLeave={handleMouseLeave}
          onClick={toggleCalendarVisibility}
        >
          <div className="clock">
            <div>{formatTime(time)}</div>
            <div>{formatDate(time)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
