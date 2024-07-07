import React, { useState, useEffect, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import '../../../assets/styles/components/taskbar/calendar/taskbarcalendaryears.css';

const TaskbarCalendarYears = ({ setActiveYear, setDisplayedYear, displayedYear, setShowDaysView, setShowMonthsView, setShowYearsView, currentYear }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [baseYear, setBaseYear] = useState(displayedYear);
  const wheelEventRef = useRef(0);
  const yearChangedRef = useRef(false);
  const [transitionClass, setTransitionClass] = useState('');

  // Handle year click to set active year and switch to month view
  const handleYearClick = (year) => {
    setActiveYear(year);
    setDisplayedYear(year);
    setShowDaysView(false);
    setShowMonthsView(true);
    setShowYearsView(false);
  };

  // Handle mouse wheel scrolling
  const handleWheel = (event) => {
    const delta = event.deltaY;
    const now = Date.now();

    if (now - wheelEventRef.current > 100) {
      wheelEventRef.current = now;

      if (delta < 0) {
        setTransitionClass('years-slide-up');
        setTimeout(() => {
          unstable_batchedUpdates(() => {
            setStartIndex((prev) => prev - 4);
            setBaseYear((prev) => prev - 4);
            yearChangedRef.current = true;
            setTransitionClass('');
          });
        }, 100);
      } else if (delta > 0) {
        setTransitionClass('years-slide-down');
        setTimeout(() => {
          unstable_batchedUpdates(() => {
            setStartIndex((prev) => prev + 4);
            setBaseYear((prev) => prev + 4);
            yearChangedRef.current = true;
            setTransitionClass('');
          });
        }, 100);
      }
    }
  };

  // Add and remove wheel event listener
  useEffect(() => {
    const container = document.querySelector('.calendar-years');
    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Adjust baseYear and startIndex to ensure the first row starts with the appropriate year from the displayed decade
  useEffect(() => {
    const decadeStartYear = Math.floor(displayedYear / 10) * 10;
    const offset = (displayedYear % 4) - 4;
    setBaseYear(decadeStartYear - offset);
    setStartIndex(offset);
  }, [displayedYear]);

  // Calculate the displayed years for the grid
  const getDisplayedYears = () => {
    const displayedYears = [];
    for (let i = -8; i < 20; i++) {  // Adjusted to add 2 extra rows, one above and one below
      const year = baseYear + i;
      displayedYears.push({
        year
      });
    }
    return displayedYears;
  };

  // Calculate the displayed decade range
  const getDisplayedDecade = () => {
    const rangeStart = displayedYear - (displayedYear % 10);
    const rangeEnd = rangeStart + 9;
    return { rangeStart, rangeEnd };
  };

  const { rangeStart, rangeEnd } = getDisplayedDecade();

  // Update displayedYear if the first row contains a new decade start
  useEffect(() => {
    const firstRowYears = getDisplayedYears().slice(4, 8); // Get the first visible row
    const firstDecadeYearInFirstRow = firstRowYears.find(item => item.year % 10 === 0);

    if (firstDecadeYearInFirstRow && yearChangedRef.current) {
      setDisplayedYear(firstDecadeYearInFirstRow.year);
      yearChangedRef.current = false;
    }
  }, [startIndex, baseYear]);

  return (
    <div className="calendar-years-container">
      <div className={`calendar-years ${transitionClass}`}>
        {getDisplayedYears().map((item, index) => (
          <div
            key={index}
            className={`calendar-year ${item.year === currentYear ? 'current-year' : ''} ${item.year >= rangeStart && item.year <= rangeEnd ? 'current-decade' : 'non-current-decade'}`}
            onClick={() => handleYearClick(item.year)}
          >
            <span>{item.year}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskbarCalendarYears;
