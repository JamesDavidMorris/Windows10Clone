import React, { useEffect, useState, useRef } from 'react';
import TaskbarCalendarDays from './taskbarcalendardays';
import TaskbarCalendarMonths from './taskbarcalendarmonths';
import TaskbarCalendarYears from './taskbarcalendaryears';
import '../../../assets/styles/components/taskbar/calendar/taskbarcalendar.css';

const ICON_TASKBAR_CALENDAR_ARROW = '/assets/images/icons/system/icon_system_arrow_1.svg';

const TaskbarCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [displayedYear, setDisplayedYear] = useState(currentDate.getFullYear());
  const periodRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState({ day: null, month: null, year: null });
  const [svgArrowContent, setSvgArrowContent] = useState('');
  const [monthChangedByArrow, setMonthChangedByArrow] = useState(false);

  const [activeMonth, setActiveMonth] = useState(currentDate.getMonth());
  const [activeYear, setActiveYear] = useState(currentDate.getFullYear());

  const [showDaysView, setShowDaysView] = useState(true);
  const [showMonthsView, setShowMonthsView] = useState(false);
  const [showYearsView, setShowYearsView] = useState(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const MIN_YEAR = currentYear - 100;
  const MAX_YEAR = currentYear + 100;

  // Update the current date every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    setPeriodPosition();

    return () => clearInterval(timer);
  }, []);

  // Update the position of the period indicator when the current date changes
  useEffect(() => {
    setPeriodPosition();
  }, [currentDate]);

  // Fetch the SVG content for the arrow icons
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

  // Set the position of the period indicator
  const setPeriodPosition = () => {
    if (periodRef.current) {
      const screenWidth = window.innerWidth;
      const periodWidth = periodRef.current.offsetWidth;
      periodRef.current.style.left = `${(screenWidth / 2) - (periodWidth / 2)}px`;
    }
  };

  // Handle clicks on a day in the calendar
  const handleDayClick = (day, month, year) => {
    setSelectedDate({ day, month, year });
  };

  // Handle clicks on the previous month arrow
  const handlePrevMonth = () => {
    setMonthChangedByArrow(true);
    const newMonth = activeMonth - 1;
    const newYear = newMonth < 0 ? displayedYear - 1 : displayedYear;
    const adjustedMonth = newMonth < 0 ? 11 : newMonth;

    setActiveMonth(adjustedMonth);
    setDisplayedYear(newYear);

    console.log('Prev Month Clicked: ', adjustedMonth, newYear);
  };

  // Handle clicks on the next month arrow
  const handleNextMonth = () => {
    setMonthChangedByArrow(true);
    const newMonth = activeMonth + 1;
    const newYear = newMonth > 11 ? displayedYear + 1 : displayedYear;
    const adjustedMonth = newMonth > 11 ? 0 : newMonth;

    setActiveMonth(adjustedMonth);
    setDisplayedYear(newYear);

    console.log('Next Month Clicked: ', adjustedMonth, newYear);
  };

  // Handle previous year click and update the displayed year
  const handlePrevYear = () => {
    setDisplayedYear((prevYear) => prevYear - 1);
  };

  // Handle next year click and update the displayed year
  const handleNextYear = () => {
    setDisplayedYear((prevYear) => prevYear + 1);
  };

  // Handle previous decade click and update the displayed year if within range
  const handlePrevDecade = () => {
    const newDisplayedYear = displayedYear - 10;
    const nearestValidDecade = getNearestValidDecade(newDisplayedYear);

    setDisplayedYear(nearestValidDecade);
  };

  // Handle next decade click and update the displayed year if within range
  const handleNextDecade = () => {
    const newDisplayedYear = displayedYear + 10;
    const nearestValidDecade = getNearestValidDecade(newDisplayedYear);

    setDisplayedYear(nearestValidDecade);
  };

  // Handle clicks on the arrow buttons with a visual effect
  const handleArrowClick = (event) => {
    const target = event.currentTarget;
    target.classList.add('clicked');
    setTimeout(() => {
      target.classList.remove('clicked');
    }, 200);
  };

  // Go back to the current day view
  const resetToCurrentDate = () => {
    setDisplayedYear(currentDate.getFullYear());
    setActiveMonth(currentDate.getMonth());
    setMonthChangedByArrow(true);
    setShowDaysView(true);
    setShowMonthsView(false);
    setShowYearsView(false);
  };

  // Adjust the displayed year to the start of a decade if it out of the MIN_YEAR & MAX_YEAR range
  const getNearestValidDecade = (year) => {
    const decadeStartYear = year - 9;
    const decadeEndYear = year + 9;

    if (decadeStartYear < MIN_YEAR) {
      return Math.ceil(MIN_YEAR / 10) * 10;
    } else if (decadeEndYear > MAX_YEAR) {
      return Math.floor((MAX_YEAR - 10) / 10) * 10;
    }

    return Math.floor(year / 10) * 10;
  };

  // Adjust the displayed year when switching to years view
  useEffect(() => {
    if (showYearsView) {
      const adjustedYear = getNearestValidDecade(displayedYear);
      setDisplayedYear(adjustedYear);
    }
  }, [showYearsView]);

  // Handle header text click to toggle between months and years view
  const handleHeaderClick = () => {
    if (showYearsView) return;

    if (showMonthsView) {
      setDisplayedYear(getNearestValidDecade(displayedYear));
      setShowYearsView(true);
      setShowMonthsView(false);
    } else {
      setShowMonthsView(true);
      setShowDaysView(false);
    }
  };

  // Format the full date text and month/year text for the calendar header
  const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const period = currentDate.toLocaleTimeString([], { hour12: true }).slice(-2);
  const fullDateText = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Get the current decade range for display
  const getCurrentYearRange = () => {
    const rangeStart = displayedYear - (displayedYear % 10);
    const rangeEnd = rangeStart + 9;
    return `${rangeStart} - ${rangeEnd}`;
  };

  // Determine the text to display in the calendar header
  const monthYearText = showYearsView
    ? getCurrentYearRange()
    : showMonthsView
    ? `${displayedYear}`
    : new Date(displayedYear, activeMonth).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

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
        <div className="clock-date" onClick={resetToCurrentDate}>{fullDateText}</div>
      </div>
      <div className="calendar-body">
        <div className="calendar-header-row">
          <div className="calendar-header clickable" style={{ gridColumn: '1 / 3' }} onClick={handleHeaderClick}>
            <h3>{monthYearText}</h3>
          </div>
          <div className="calendar-arrows" style={{ gridColumn: '6 / 7' }}>
            {showMonthsView ? (
              <div
                className="calendar-arrow-up"
                onClick={(e) => { handlePrevYear(); handleArrowClick(e); }}
                dangerouslySetInnerHTML={{ __html: svgArrowContent }}
              />
            ) : showYearsView ? (
              <div
                className="calendar-arrow-up"
                onClick={(e) => { handlePrevDecade(); handleArrowClick(e); }}
                dangerouslySetInnerHTML={{ __html: svgArrowContent }}
              />
            ) : (
              <div
                className="calendar-arrow-up"
                onClick={(e) => { handlePrevMonth(); handleArrowClick(e); }}
                dangerouslySetInnerHTML={{ __html: svgArrowContent }}
              />
            )}
          </div>
          <div className="calendar-arrows" style={{ gridColumn: '7 / 8' }}>
            {showMonthsView ? (
              <div
                className="calendar-arrow-down"
                onClick={(e) => { handleNextYear(); handleArrowClick(e); }}
                dangerouslySetInnerHTML={{ __html: svgArrowContent }}
              />
            ) : showYearsView ? (
              <div
                className="calendar-arrow-down"
                onClick={(e) => { handleNextDecade(); handleArrowClick(e); }}
                dangerouslySetInnerHTML={{ __html: svgArrowContent }}
              />
            ) : (
              <div
                className="calendar-arrow-down"
                onClick={(e) => { handleNextMonth(); handleArrowClick(e); }}
                dangerouslySetInnerHTML={{ __html: svgArrowContent }}
              />
            )}
          </div>
        </div>
        {showDaysView ? (
          <TaskbarCalendarDays
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
        ) : null}
        {showMonthsView ? (
          <TaskbarCalendarMonths
            setActiveMonth={setActiveMonth}
            setDisplayedYear={setDisplayedYear}
            displayedYear={displayedYear}
            setShowDaysView={setShowDaysView}
            setShowMonthsView={setShowMonthsView}
            setShowYearsView={setShowYearsView}
            currentYear={currentYear}
            currentMonth={currentMonth}
            minYear={MIN_YEAR}
            maxYear={MAX_YEAR}
          />
        ) : null}
        {showYearsView ? (
          <TaskbarCalendarYears
            setActiveYear={setActiveYear}
            setDisplayedYear={setDisplayedYear}
            setShowDaysView={setShowDaysView}
            setShowMonthsView={setShowMonthsView}
            setShowYearsView={setShowYearsView}
            displayedYear={displayedYear}
            currentYear={currentYear}
            minYear={MIN_YEAR}
            maxYear={MAX_YEAR}
          />
        ) : null}
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
