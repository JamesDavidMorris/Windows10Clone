import React, { useEffect, useState } from 'react';
import '../../../assets/styles/components/applications/calendar/applicationcalendar.css';
import { icon_taskbar_calender_calendar, icon_application_outlook, icon_application_gmail, icon_application_yahoomail, icon_system_application_close_000000 } from '../../extensions/icons/icons';

const ICON_TASKBAR_CALENDAR_PLUS = '/assets/images/icons/taskbar/calendar/icon_taskbar_calendar_plus_1.svg';

const ApplicationCalendar = () => {
  const [svgPlusContent, setSvgPlusContent] = useState('');
  const [isErrorVisible, setIsErrorVisible] = useState(false);

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

  // Show the error box after 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsErrorVisible(true);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  // Handle the cancel button click
  const handleCancelClick = () => {
    setIsErrorVisible(false);

    // Show the error box again after closing it
    setTimeout(() => {
      setIsErrorVisible(true);
    }, 250);
  };

  // Handle the close button click
  const handleCloseClick = () => {
    setIsErrorVisible(false);

    // Show the error box again after closing it
    setTimeout(() => {
      setIsErrorVisible(true);
    }, 250);
  };

  return (
    <div className="application-calendar-container">
      <div className="application-calendar-outer-container">
        <div className="application-calendar">
          <img src={icon_taskbar_calender_calendar} alt="Calendar Icon" className="calendar-icon-large" />
          <h1 className="calendar-welcome-text">Welcome to Calendar</h1>
          <p className="calendar-instruction-text">
            Add your accounts to keep up to date across devices.
          </p>
          <div className="calendar-account-box">
            <div className="calendar-account-icons">
              <img src={icon_application_outlook} alt="Outlook" />
              <img src={icon_application_gmail} alt="Gmail" />
              <img src={icon_application_yahoomail} alt="Yahoo" />
            </div>
            <div className="calendar-add-account">
              <div
                className="add-account-icon-svg"
                dangerouslySetInnerHTML={{ __html: svgPlusContent }}
              />
              <span>Add account</span>
            </div>
            <div className="calendar-divider"></div>
            <div className="calendar-go-to">
              <a href="#">Go to calendar</a>
            </div>
          </div>
        </div>
      </div>

      {/* Error Box */}
      {isErrorVisible && (
        <div className="network-error-box">
          <button className="error-box-close-button" onClick={handleCloseClick}>
            <img src={icon_system_application_close_000000} alt="Close" />
          </button>
          <p className="error-title">You’ll need the Internet for this.</p>
          <p className="error-message">It doesn’t look like you’re connected to the Internet. Check your connection and try again.</p>
          <p className="error-code">0x800713AB</p>
          <a href="#" className="error-feedback">Send feedback</a>
          <button className="cancel-button" onClick={handleCancelClick}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ApplicationCalendar;
