import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../../assets/styles/components/taskbar/calendar/taskbarcalendarmonths.css';

const TaskbarCalendarMonths = ({ setActiveMonth, setDisplayedYear, displayedYear, setShowDaysView, setShowMonthsView, currentYear, currentMonth }) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [baseYear, setBaseYear] = useState(displayedYear);
  const wheelEventRef = useRef(0);
  const yearChangedRef = useRef(false);

  const handleMonthClick = (monthIndex, year) => {
    setActiveMonth(monthIndex);
    setDisplayedYear(year);
    setShowDaysView(true);
    setShowMonthsView(false);
  };

  const handleWheel = (event) => {
    const delta = event.deltaY;
    const now = Date.now();

    if (now - wheelEventRef.current > 50) {
      wheelEventRef.current = now;

      if (delta < 0) {
        setStartIndex((prev) => (prev - 4 + months.length) % months.length);
        if (startIndex <= 3) {
          setBaseYear((prev) => prev - 1);
          yearChangedRef.current = true;
        }
      } else if (delta > 0) {
        setStartIndex((prev) => (prev + 4) % months.length);
        if (startIndex >= months.length - 4) {
          setBaseYear((prev) => prev + 1);
          yearChangedRef.current = true;
        }
      }
    }
  };

  useEffect(() => {
    const container = document.querySelector('.calendar-months');
    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  useEffect(() => {
    setBaseYear(displayedYear);
    setStartIndex(0);
  }, [displayedYear]);

  const getDisplayedMonths = () => {
    const displayedMonths = [];
    for (let i = 0; i < 16; i++) {
      const monthIndex = (startIndex + i) % months.length;
      const yearOffset = Math.floor((startIndex + i) / months.length);
      displayedMonths.push({
        month: months[monthIndex],
        monthIndex,
        year: baseYear + yearOffset
      });
    }
    return displayedMonths;
  };

  useEffect(() => {
    const firstRowMonths = getDisplayedMonths().slice(0, 4);
    const lastJanuaryInFirstRow = firstRowMonths.find(item => item.month === 'Jan');

    if (lastJanuaryInFirstRow && yearChangedRef.current) {
      setDisplayedYear(lastJanuaryInFirstRow.year);
      yearChangedRef.current = false;
    }
  }, [startIndex, baseYear]);

  return (
    <div className="calendar-months">
      {getDisplayedMonths().map((item, index) => (
        <div
          key={index}
          className={`calendar-month ${item.monthIndex === currentMonth && item.year === currentYear ? 'current-month' : ''} ${item.year !== displayedYear ? 'non-current-year' : ''}`}
          onClick={() => handleMonthClick(item.monthIndex, item.year)}
        >
          <span>{item.month}</span>
        </div>
      ))}
    </div>
  );
};

export default TaskbarCalendarMonths;
