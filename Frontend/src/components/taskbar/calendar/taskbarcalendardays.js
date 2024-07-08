import React, { useEffect, useState, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import '../../../assets/styles/components/taskbar/calendar/taskbarcalendardays.css';

const generateCalendarWeeks = (startYear, startMonth, monthsToGenerate) => {
  const weeks = [];

  // Loop through the months to generate weeks
  for (let i = -monthsToGenerate; i <= monthsToGenerate; i++) {
    const month = startMonth + i;
    const year = startYear + Math.floor(month / 12);
    const adjustedMonth = (month + 12) % 12;
    const daysInMonth = new Date(year, adjustedMonth + 1, 0).getDate();
    const startDayOfWeek = new Date(year, adjustedMonth, 1).getDay();
    const daysInPreviousMonth = new Date(year, adjustedMonth, 0).getDate();

    let currentWeek = [];

    // Fill in days from previous month
    for (let j = startDayOfWeek - 1; j >= 0; j--) {
      currentWeek.unshift({
        day: daysInPreviousMonth - j,
        month: adjustedMonth === 0 ? 11 : adjustedMonth - 1,
        year: adjustedMonth === 0 ? year - 1 : year,
        currentMonth: false
      });
    }

    // Fill in days from current month
    for (let j = 1; j <= daysInMonth; j++) {
      currentWeek.push({
        day: j,
        month: adjustedMonth,
        year: year,
        currentMonth: true
      });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days to the next week
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
  }

  // Ensure the last week has exactly 7 days
  const lastWeek = weeks[weeks.length - 1];
  if (lastWeek.length < 7) {
    let day = 1;
    const nextMonth = (startMonth + monthsToGenerate + 1) % 12;
    const nextYear = startYear + Math.floor((startMonth + monthsToGenerate + 1) / 12);
    while (lastWeek.length < 7) {
      lastWeek.push({
        day: day++,
        month: nextMonth,
        year: nextYear,
        currentMonth: false
      });
    }
  }

  // Ensure each week has exactly 7 days and fix any reverse order issues
  return weeks.filter((week) => week.length === 7).map((week) =>
    week.sort((a, b) => (a.year === b.year ? (a.month === b.month ? a.day - b.day : a.month - b.month) : a.year - b.year))
  );
};

const TaskbarCalendarDays = ({
  currentDate,
  handleDayClick,
  selectedDate,
  activeMonth,
  setActiveMonth,
  displayedYear,
  setDisplayedYear,
  setMonthChangedByArrow,
  monthChangedByArrow,
}) => {
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [weekIndex, setWeekIndex] = useState(0);
  const [transitionClass, setTransitionClass] = useState('');
  const isInitialRender = useRef(true);
  const [shouldRegenerate, setShouldRegenerate] = useState(false); // Track if we should regenerate weeks
  const wheelEventRef = useRef(0);
  const tableRef = useRef(null);

  // Determine if a row is not visible
  const isDisabledRow = (index, length) => index < 1 || index >= length - 1;

  // Function to update the calendar weeks based on the current year and active month
  const updateCalendarWeeks = () => {
    if (displayedYear !== undefined && activeMonth !== undefined) {
      const weeks = generateCalendarWeeks(displayedYear, activeMonth, 6);
      setCalendarWeeks(weeks);
      const initialIndex = weeks.findIndex((week) => week.some((day) => day.month === activeMonth && day.year === displayedYear));
      setWeekIndex(initialIndex);
    }
  };

  // Effect to update calendar weeks when monthChangedByArrow or displayedYear changes
  useEffect(() => {
    updateCalendarWeeks();
  }, [monthChangedByArrow, displayedYear]);

  // Effect to update the active month and year based on weekIndex and calendarWeeks changes
  useEffect(() => {
    if (!isInitialRender.current) {
      updateActiveMonthAndYear();
    }
    isInitialRender.current = false;
  }, [weekIndex, calendarWeeks]);

  // Trigger calendar weeks regeneration when needed
  useEffect(() => {
    if (shouldRegenerate) {
      updateCalendarWeeks();
      setShouldRegenerate(false);
    }
  }, [shouldRegenerate]);

  // Function to update the active month and displayed year based on the current weeks in view
  const updateActiveMonthAndYear = () => {
    const weeksToDisplay = calendarWeeks.slice(weekIndex, weekIndex + 6);
    const monthCounts = {};
    const yearCounts = {};

    weeksToDisplay.forEach((week) => {
      week.forEach((day) => {
        if (monthCounts[day.month]) {
          monthCounts[day.month]++;
        } else {
          monthCounts[day.month] = 1;
        }
        if (yearCounts[day.year]) {
          yearCounts[day.year]++;
        } else {
          yearCounts[day.year] = 1;
        }
      });
    });

    const newActiveMonth = Object.keys(monthCounts).reduce((a, b) => (monthCounts[a] > monthCounts[b] ? a : b), null);
    const newDisplayedYear = Object.keys(yearCounts).reduce((a, b) => (yearCounts[a] > yearCounts[b] ? a : b), null);

    // Only update activeMonth if it has changed
    if (Number(newActiveMonth) !== activeMonth) {
      setActiveMonth(Number(newActiveMonth));
    }

    // Only update displayedYear if it has changed
    if (Number(newDisplayedYear) !== displayedYear) {
      setDisplayedYear(Number(newDisplayedYear));
    }

    // Only update monthChangedByArrow if it has changed
    if (setMonthChangedByArrow) {
      setMonthChangedByArrow(false);
    }
  };

  // Function to render each day cell in the calendar
  const renderDay = (day, month, year) => {
    const isToday = month === currentDate.getMonth() && year === currentDate.getFullYear() && day === currentDate.getDate();
    const isSelected = day === selectedDate.day && month === selectedDate.month && year === selectedDate.year;
    const isActiveMonth = month === activeMonth;
    const className = `${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isActiveMonth ? '' : 'other-month'}`;

    return (
      <td key={`${day}-${month}-${year}`} onClick={() => handleDayClick(day, month, year)} className={className}>
        {day}
      </td>
    );
  };

  // Function to render the calendar weeks
  const renderCalendar = () => {
    const startIndex = Math.max(weekIndex - 1, 0);
    const endIndex = weekIndex + 6 + 1;
    const weeksToDisplay = calendarWeeks.slice(startIndex, endIndex);

    const rows = [];
    weeksToDisplay.forEach((week, i) => {
      const cells = week.map((dayObj) => renderDay(dayObj.day, dayObj.month, dayObj.year));
      rows.push(
      <tr
        key={i}
        className={isDisabledRow(i, weeksToDisplay.length) ? 'disabled-row' : ''}
      >
        {cells}
      </tr>
    );
  });

    return rows;
  };

  // Event handler for mouse wheel scrolling
  const handleWheel = (event) => {
    const delta = event.deltaY; // Determine scroll direction
    const maxWeeks = Math.max(calendarWeeks.length - 6, 0); // Calculate the maximum number of weeks that can be displayed
    const now = Date.now(); // Get the current timestamp

    // Check if the last wheel event was more than 50ms ago to debounce rapid scrolling
    if (now - wheelEventRef.current > 50) {
      wheelEventRef.current = now; // Update the timestamp of the last wheel event

      // Handle scrolling up (previous week)
      if (delta < 0 && weekIndex > 0) {
        setTransitionClass('days-slide-up'); // Apply the slide-up animation

        // After the animation completes, update the week index and reset the animation
        setTimeout(() => {
          unstable_batchedUpdates(() => {
            setWeekIndex((prev) => {
              const newIndex = Math.max(prev - 1, 0); // Decrease the week index by 1 but ensure it doesn't go below 0

              // Trigger regeneration if the first week is in view and we're scrolling up
              if (newIndex === 0) {
                setShouldRegenerate(true);
              }

              return newIndex;
            });

            setTransitionClass('');
          });
        }, 100);
      // Handle scrolling down (next week)
      } else if (delta > 0 && weekIndex < maxWeeks) {
        setTransitionClass('days-slide-down'); // Apply the slide-down animation

        // After the animation completes, update the week index and reset the animation
        setTimeout(() => {
          unstable_batchedUpdates(() => {
            setWeekIndex((prev) => {
              const newIndex = Math.min(prev + 1, maxWeeks); // Increase the week index by 1 but ensure it doesn't exceed maxWeeks

              // Trigger regeneration if the last week is in view and we're scrolling down
              if (newIndex === maxWeeks) {
                setShouldRegenerate(true);
              }

              return newIndex;
            });

            setTransitionClass('');
          });
        }, 100);
      }
    }
  };

  return (
    <div className="calendar-grid" onWheel={handleWheel}>
      <div className="calendar-table-header">
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>
      <div className="calendar-table-container">
        <table className={`calendar-table ${transitionClass}`} ref={tableRef}>
          <tbody>{renderCalendar()}</tbody>
        </table>
      </div>
    </div>
  );
};

export { generateCalendarWeeks };
export default TaskbarCalendarDays;
