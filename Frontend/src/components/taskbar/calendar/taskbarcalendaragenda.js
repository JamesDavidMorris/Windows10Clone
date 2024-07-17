import React, { useEffect, useState } from 'react';
import ApplicationCalendar from '../../applications/calendar/applicationcalendar';
import '../../../assets/styles/components/taskbar/calendar/taskbarcalendaragenda.css';
import { icon_taskbar_calender_calendar } from '../../extensions/icons/icons';

const ICON_TASKBAR_CALENDAR_PLUS = '/assets/images/icons/taskbar/calendar/icon_taskbar_calendar_plus_1.svg';

const TaskbarCalendarAgenda = ({ setIsCalendarVisible }) => {
  const [svgPlusContent, setSvgPlusContent] = useState('');
  const [isApplicationCalendarVisible, setIsApplicationCalendarVisible] = useState(false);

  // Fetch the SVG content for the plus icon
  useEffect(() => {
    const fetchSVG = async () => {
      try {
        const response = await fetch(ICON_TASKBAR_CALENDAR_PLUS);
        const text = await response.text();
        setSvgPlusContent(text);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };
    fetchSVG();
  }, []);

  const handleCalendarClick = () => {
    setIsApplicationCalendarVisible(prev => !prev);
    setIsCalendarVisible(false);
  };

  return (
    <>
      <div className="calendar-agenda">
        <div className="agenda-header">
          <span className="header-text">Today</span>
          <div></div> {/* Empty column for alignment */}
          <div className="header-icon-container" onClick={handleCalendarClick}>
            <div
              className="header-icon"
              dangerouslySetInnerHTML={{ __html: svgPlusContent }}
            />
          </div>
        </div>
        <div className="agenda-body">
          <img src={icon_taskbar_calender_calendar} alt="Calendar Icon" className="agenda-icon" />
          <p className="agenda-body-text">Set up your calendars to see where you need to be</p>
          <div></div> {/* Empty column for alignment */}
        </div>
        <button className="agenda-button" onClick={handleCalendarClick}>
          Get Started
        </button>
      </div>
      {isApplicationCalendarVisible && <ApplicationCalendar />}
    </>
  );
};

export default TaskbarCalendarAgenda;
