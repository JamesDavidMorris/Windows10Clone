import React, { useEffect, useState, useRef } from 'react';
import TaskbarCalendarGrid from './taskbarcalendargrid';
import '../../assets/styles/components/taskbar/taskbarcalendar.css';

const ICON_TASKBAR_CALENDAR_ARROW = '/assets/images/icons/system/icon_system_arrow_1.svg';

const TaskbarCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayedMonth, setDisplayedMonth] = useState(currentDate.getMonth());
  const [displayedYear, setDisplayedYear] = useState(currentDate.getFullYear());
  const periodRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState({ day: null, month: null, year: null });
  const [svgArrowContent, setSvgArrowContent] = useState('');
  const [activeMonth, setActiveMonth] = useState(currentDate.getMonth());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    setPeriodPosition();

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setPeriodPosition();
  }, [currentDate]);

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

  const setPeriodPosition = () => {
    if (periodRef.current) {
      const screenWidth = window.innerWidth;
      const periodWidth = periodRef.current.offsetWidth;
      periodRef.current.style.left = `${(screenWidth / 2) - (periodWidth / 2)}px`;
    }
  };

  const handleDayClick = (day, month, year) => {
    setSelectedDate({ day, month, year });
  };

  const handlePrevMonth = () => {
    console.log('Prev Month. Displayed: ', displayedMonth, 'Active: ', activeMonth);
    let newMonth = displayedMonth - 1;
    let newYear = displayedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setDisplayedMonth(activeMonth - 1);
    setDisplayedYear(newYear);
    setActiveMonth(newMonth);
    console.log('Prev Month Clicked: ', newMonth, newYear);
  };

  const handleNextMonth = () => {
    console.log('Next Month. Displayed: ', displayedMonth, 'Active: ', activeMonth);
    let newMonth = displayedMonth + 1;
    let newYear = displayedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setDisplayedMonth(activeMonth + 1);
    setDisplayedYear(newYear);
    setActiveMonth(newMonth);
    console.log('Next Month Clicked: ', newMonth, newYear);
  };

  const handleArrowClick = (event) => {
    const target = event.currentTarget;
    target.classList.add('clicked');
    setTimeout(() => {
      target.classList.remove('clicked');
    }, 200);
  };

  const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const period = currentDate.toLocaleTimeString([], { hour12: true }).slice(-2);
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
          displayedMonth={displayedMonth}
          displayedYear={displayedYear}
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
