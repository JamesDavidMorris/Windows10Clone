import React, { useEffect, useState } from 'react';
import '../../assets/styles/components/taskbar/taskbar.css';

// Functionality
import StartMenu from '../startmenu/startmenu';

// Icons
import icon_system_sound_max from '../../assets/images/icons/system/icon_system_sound_max_1.png';
import icon_system_network_connected from '../../assets/images/icons/system/icon_system_network_connected_1.png';
import icon_system_tray_open from '../../assets/images/icons/system/icon_system_tray_open_1.png';

const ICON_TASKBAR_START_LOGO = '/assets/images/icons/taskbar/start/icon_taskbar_start_logo_1.svg'; // Updated path to the SVG in the public folder

const Taskbar = () => {
  const [time, setTime] = useState(new Date());
  const [isStartMenuVisible, setStartMenuVisible] = useState(false);
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Fetch the SVG content
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

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <div className="start-button-background" onClick={() => setStartMenuVisible(!isStartMenuVisible)}>
          <button className="start-button">
            <div dangerouslySetInnerHTML={{ __html: svgContent }} className="start-logo" />
          </button>
        </div>
      </div>
      <div className="taskbar-right">
        <div className="system-tray">
          <div className="system-icon-background">
            <img src={icon_system_tray_open} alt="Show hidden icons" className="system-icon" />
          </div>
          <div className="system-icon-background">
            <img src={icon_system_network_connected} alt="Internet Access" className="system-icon" />
          </div>
          <div className="system-icon-background">
            <img src={icon_system_sound_max} alt="Sound" className="system-icon" />
          </div>
        </div>
        <div className="clock-background">
          <div className="clock">
            <div>{formatTime(time)}</div>
            <div>{formatDate(time)}</div>
          </div>
        </div>
      </div>
      <StartMenu isVisible={isStartMenuVisible} toggleVisibility={() => setStartMenuVisible(!isStartMenuVisible)} />
    </div>
  );
};

export default Taskbar;
