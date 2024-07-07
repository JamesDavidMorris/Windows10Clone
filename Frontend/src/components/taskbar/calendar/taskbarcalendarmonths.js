import React, { useState, useEffect, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
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
  const [transitionClass, setTransitionClass] = useState('');

  // Handle month click to set active month and switch to day view
  const handleMonthClick = (monthIndex, year) => {
    setActiveMonth(monthIndex);
    setDisplayedYear(year);
    setShowDaysView(true);
    setShowMonthsView(false);
  };

  // Handle mouse wheel scrolling
  const handleWheel = (event) => {
    const delta = event.deltaY;
    const now = Date.now();

    if (now - wheelEventRef.current > 100) {
      wheelEventRef.current = now;

      if (delta < 0) {
        setTransitionClass('slide-up');
        setTimeout(() => {
          unstable_batchedUpdates(() => {
            setStartIndex((prev) => (prev - 4 + months.length) % months.length);
            if (startIndex <= 3) {
              setBaseYear((prev) => prev - 1);
              yearChangedRef.current = true;
            }
            setTransitionClass('');
          });
        }, 100);
      } else if (delta > 0) {
        setTransitionClass('slide-down');
        setTimeout(() => {
          unstable_batchedUpdates(() => {
            setStartIndex((prev) => (prev + 4) % months.length);
            if (startIndex >= months.length - 4) {
              setBaseYear((prev) => prev + 1);
              yearChangedRef.current = true;
            }
            setTransitionClass('');
          });
        }, 100);
      }
    }
  };

  // Add and remove wheel event listener
  useEffect(() => {
    const container = document.querySelector('.calendar-months');
    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Adjust baseYear and startIndex to ensure the first row starts with the appropriate year from the displayed year
  useEffect(() => {
    setBaseYear(displayedYear);
    setStartIndex(0);
  }, [displayedYear]);

  // Calculate the displayed months for the grid
  const getDisplayedMonths = () => {
    const displayedMonths = [];
    for (let i = -4; i < 20; i++) {  // Adjusted to add 2 extra rows, one above and one below
      const monthIndex = (startIndex + i + months.length) % months.length;
      const yearOffset = Math.floor((startIndex + i) / months.length);
      displayedMonths.push({
        month: months[monthIndex],
        monthIndex,
        year: baseYear + yearOffset
      });
    }
    return displayedMonths;
  };

  // Update displayedYear if the first row contains January
  useEffect(() => {
    const firstRowMonths = getDisplayedMonths().slice(4, 8); // Adjusted to the visible first row
    const lastJanuaryInFirstRow = firstRowMonths.find(item => item.month === 'Jan');

    if (lastJanuaryInFirstRow && yearChangedRef.current) {
      setDisplayedYear(lastJanuaryInFirstRow.year);
      yearChangedRef.current = false;
    }
  }, [startIndex, baseYear]);

  return (
    <div className="calendar-months-container">
      <div className={`calendar-months ${transitionClass}`}>
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
    </div>
  );
};

export default TaskbarCalendarMonths;
