import React from 'react';
import '../../../assets/styles/components/taskbar/calendar/taskbaragenda.css';
import { icon_taskbar_calender_calendar, icon_taskbar_calender_plus } from '../../extensions/icons/icons';

const TaskbarAgenda = () => {
  return (
    <div className="calendar-agenda">
      <div className="agenda-header">
        <span className="header-text">Today</span>
        <div></div> {/* Empty column for alignment */}
        <div className="header-icon-container">
          <img src={icon_taskbar_calender_plus} alt="Plus Icon" className="header-icon" />
        </div>
      </div>
      <div className="agenda-body">
        <img src={icon_taskbar_calender_calendar} alt="Calendar Icon" className="agenda-icon" />
        <p className="agenda-body-text">Set up your calendars to see where you need to be</p>
        <div></div> {/* Empty column for alignment */}
      </div>
      <button className="agenda-button">Get started</button>
    </div>
  );
};

export default TaskbarAgenda;
