import React from 'react';
import '../../../assets/styles/components/applications/calendar/applicationcalendar.css';

const ApplicationCalendar = () => {
  console.log('ApplicationCalendar: Component loaded');

  return (
    <div className="application-calendar-container">
      <div className="application-calendar">
        <h1>Calendar Application</h1>
        {/* Content of the application calendar */}
      </div>
    </div>
  );
};

export default ApplicationCalendar;