import React, { useState, useEffect, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import '../../../assets/styles/components/taskbar/calendar/taskbarcalendarmonths.css';

const TaskbarCalendarMonths = ({ setActiveMonth, setDisplayedYear, displayedYear, setShowDaysView, setShowMonthsView, currentYear, currentMonth, minYear, maxYear }) => {
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

  // Determine if a row is not visible
  const isDisabledRow = (index, length, lastRowVisible) => {
    if (lastRowVisible) {
      return index < 4 || index >= length;
    }
    return index < 4 || index >= length - 4;
  };

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

      if (delta < 0 && !(baseYear === minYear && startIndex <= 3)) {
        // Scrolling up, but ensure it doesn't go below minYear or show the previous year's months
        setTransitionClass('slide-up');
        setTimeout(() => {
          unstable_batchedUpdates(() => {
            setStartIndex((prev) => (prev - 4 + months.length) % months.length);
            if (startIndex <= 3) {
              setBaseYear((prev) => Math.max(prev - 1, minYear));
              yearChangedRef.current = true;
            }
            setTransitionClass('');
          });
        }, 100);
      } else if (delta > 0) {
        // Scrolling down, but ensure it doesn't go above maxYear or show the next year's months
        if (baseYear < maxYear - 1 || baseYear === maxYear - 1 && startIndex < months.length - 4) {
          setTransitionClass('slide-down');
          setTimeout(() => {
            unstable_batchedUpdates(() => {
              setStartIndex((prev) => (prev + 4) % months.length);
              if (startIndex >= months.length - 4 && baseYear < maxYear) {
                setBaseYear((prev) => Math.min(prev + 1, maxYear));
                yearChangedRef.current = true;
              }
              setTransitionClass('');
            });
          }, 100);
        }
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

    // If at the max year, shift the cells down
    let lastRowVisible = false;
    let startingRowIndex = -4;
    if (baseYear === maxYear)
    {
      startingRowIndex = -8;
    }

    for (let i = startingRowIndex; i < 20; i++) {
      const monthIndex = (startIndex + i + months.length) % months.length;
      const yearOffset = Math.floor((startIndex + i) / months.length);
      const year = baseYear + yearOffset;

      if (year === maxYear + 1) {
        lastRowVisible = true;
      }

      if (year > maxYear) break;

      displayedMonths.push({
        month: months[monthIndex],
        monthIndex,
        year
      });
    }
    return { displayedMonths, lastRowVisible };
  };

  // Update displayedYear if the first row contains January
  useEffect(() => {
    const { displayedMonths } = getDisplayedMonths();
    const firstRowMonths = displayedMonths.slice(4, 8); // Adjusted to the visible first row
    const lastJanuaryInFirstRow = firstRowMonths.find(item => item.month === 'Jan');

    if (lastJanuaryInFirstRow && yearChangedRef.current) {
      setDisplayedYear(lastJanuaryInFirstRow.year);
      yearChangedRef.current = false;
    }
  }, [startIndex, baseYear]);

  const { displayedMonths, lastRowVisible } = getDisplayedMonths();

  return (
    <div className="calendar-months-container">
      <div className={`calendar-months ${transitionClass}`}>
        {displayedMonths.map((item, index) => (
          <div
            key={index}
            className={`calendar-month ${item.monthIndex === currentMonth && item.year === currentYear ? 'current-month' : ''} ${item.year !== displayedYear ? 'non-current-year' : ''} ${isDisabledRow(index, displayedMonths.length, lastRowVisible) ? 'disabled-row' : ''}`}
            onClick={() => !isDisabledRow(index, displayedMonths.length, lastRowVisible) && handleMonthClick(item.monthIndex, item.year)}
          >
            <span>{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskbarCalendarMonths;
