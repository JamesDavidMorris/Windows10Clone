import React, { useEffect, useState, useRef } from 'react';
import TaskbarCalendarGrid from './taskbarcalendargrid';
import '../../assets/styles/components/taskbar/taskbarcalendar.css';

const ICON_TASKBAR_CALENDAR_ARROW = '/assets/images/icons/system/icon_system_arrow_1.svg';

const TaskbarCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayedYear, setDisplayedYear] = useState(currentDate.getFullYear());
  const periodRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState({ day: null, month: null, year: null });
  const [svgArrowContent, setSvgArrowContent] = useState('');
  const [activeMonth, setActiveMonth] = useState(currentDate.getMonth());
  const [monthChangedByArrow, setMonthChangedByArrow] = useState(false); // Track month change by arrows

  // Effect to update the current date every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // Set the position of the period indicator
    setPeriodPosition();

    // Cleanup the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  // Effect to update the position of the period indicator when the current date changes
  useEffect(() => {
    setPeriodPosition();
  }, [currentDate]);

  // Effect to fetch the SVG content for the arrow icons
  useEffect(() => {
    const fetchSVG = async () => {
      try {
        const response = await fetch(ICON_TASKBAR_CALENDAR_ARROW);
        const text = await response.text();
        setSvgArrowContent(text);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };
    fetchSVG();
  }, []);

  // Function to set the position of the period indicator
  const setPeriodPosition = () => {
    if (periodRef.current) {
      const screenWidth = window.innerWidth;
      const periodWidth = periodRef.current.offsetWidth;
      periodRef.current.style.left = `${(screenWidth / 2) - (periodWidth / 2)}px`;
    }
  };

  // Function to handle clicks on a day in the calendar
  const handleDayClick = (day, month, year) => {
    setSelectedDate({ day, month, year });
  };

  // Function to handle clicks on the previous month arrow
  const handlePrevMonth = () => {
    setMonthChangedByArrow(true); // Indicate month change by arrows
    const newMonth = activeMonth - 1;
    const newYear = newMonth < 0 ? displayedYear - 1 : displayedYear;
    const adjustedMonth = newMonth < 0 ? 11 : newMonth;

    setActiveMonth(adjustedMonth);
    setDisplayedYear(newYear);

    console.log('Prev Month Clicked: ', adjustedMonth, newYear);
  };

  // Function to handle clicks on the next month arrow
  const handleNextMonth = () => {
    setMonthChangedByArrow(true); // Indicate month change by arrows
    const newMonth = activeMonth + 1;
    const newYear = newMonth > 11 ? displayedYear + 1 : displayedYear;
    const adjustedMonth = newMonth > 11 ? 0 : newMonth;

    setActiveMonth(adjustedMonth);
    setDisplayedYear(newYear);

    console.log('Next Month Clicked: ', adjustedMonth, newYear);
  };

  // Effect to log state updates for debugging purposes
  useEffect(() => {
    console.log('State updated. Active:', activeMonth, 'Year:', displayedYear);
  }, [activeMonth, displayedYear]);

  // Function to handle clicks on the arrow buttons with a visual effect
  const handleArrowClick = (event) => {
    const target = event.currentTarget;
    target.classList.add('clicked');
    setTimeout(() => {
      target.classList.remove('clicked');
    }, 200);
  };

  // Format the current time and period (AM/PM)
  const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const period = currentDate.toLocaleTimeString([], { hour12: true }).slice(-2);

  // Format the full date text and month/year text for the calendar header
  const fullDateText = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const monthYearText = new Date(displayedYear, activeMonth).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className="taskbar-calendar">
      <div className="calendar-clock">
        <div className="clock-time-container">
          <div className="clock-time">
            {formattedTime}
          </div>
          <div ref={periodRef} className="clock-period">
            {period}
          </div>
        </div>
        <div className="clock-date">{fullDateText}</div>
      </div>
      <div className="calendar-body">
        <div className="calendar-header-row">
          <div className="calendar-header" style={{ gridColumn: '1 / 3' }}>
            <h3>{monthYearText}</h3>
          </div>
          <div className="calendar-arrows" style={{ gridColumn: '6 / 7' }}>
            <div
              className="calendar-arrow-up"
              onClick={(e) => { handlePrevMonth(); handleArrowClick(e); }}
              dangerouslySetInnerHTML={{ __html: svgArrowContent }}
            />
          </div>
          <div className="calendar-arrows" style={{ gridColumn: '7 / 8' }}>
            <div
              className="calendar-arrow-down"
              onClick={(e) => { handleNextMonth(); handleArrowClick(e); }}
              dangerouslySetInnerHTML={{ __html: svgArrowContent }}
            />
          </div>
        </div>
        <TaskbarCalendarGrid
          currentDate={currentDate}
          handleDayClick={handleDayClick}
          selectedDate={selectedDate}
          activeMonth={activeMonth}
          setActiveMonth={setActiveMonth}
          displayedYear={displayedYear}
          setDisplayedYear={setDisplayedYear}
          setMonthChangedByArrow={setMonthChangedByArrow}
          monthChangedByArrow={monthChangedByArrow}
        />
      </div>
      <div className="calendar-agenda">
        <div className="agenda-header">
          <h4>Today</h4>
        </div>
        <div className="agenda-body">
          <p>Set up your calendars to see where you need to be</p>
          <button className="agenda-button">Get started</button>
        </div>
      </div>
    </div>
  );
};

export default TaskbarCalendar;
