import React from 'react';
import ApplicationFrame from '../../extensions/application/applicationframe';
import ApplicationCalendar from './applicationcalendar';

import iconImage from '../../../assets/images/icons/application/icon_application_calendar_1.png';
import backgroundImage from '../../../assets/images/components/applications/calendar/application-calendar-background.png';

const ApplicationFrameCalendar = ({ onClose, ...props }) => {
  console.log('ApplicationFrameCalendar: Component loaded');

  return (
    <ApplicationFrame {...props} onClose={onClose}>
      <ApplicationCalendar />
    </ApplicationFrame>
  );
};

ApplicationFrameCalendar.defaultProps = {
  icon: iconImage,
  title: "Calendar",
  defaultWidth: 800,
  defaultHeight: 600,
  topBarColor: "#135995",
  backgroundColor: "#124884",
  backgroundImage: backgroundImage,
  minimizeButtonColor: "#0077d7",
  maximizeButtonColor: "#0077d7",
  // closeButtonColor: "#ea1022"
};

export default ApplicationFrameCalendar;
