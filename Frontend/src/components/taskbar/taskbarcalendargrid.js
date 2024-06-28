import React, { useEffect, useState } from 'react';
import '../../assets/styles/components/taskbar/taskbarcalendar.css';

const generateCalendarWeeks = (startYear, startMonth, monthsToGenerate) => {
  const weeks = [];

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
  const cleanedWeeks = weeks.filter(week => week.length === 7).map(week => {
    return week.sort((a, b) => a.year === b.year ? (a.month === b.month ? a.day - b.day : a.month - b.month) : a.year - b.year);
  });

  return cleanedWeeks;
};

const TaskbarCalendarGrid = ({ currentDate, handleDayClick, selectedDate, activeMonth, setActiveMonth, displayedMonth, displayedYear }) => {
  const [calendarWeeks, setCalendarWeeks] = useState([]);
  const [weekIndex, setWeekIndex] = useState(0);

  useEffect(() => {
    const weeks = generateCalendarWeeks(displayedYear, displayedMonth, 6);
    setCalendarWeeks(weeks);
    const initialIndex = weeks.findIndex(week => week.some(day => day.month === displayedMonth && day.year === displayedYear));
    setWeekIndex(initialIndex);
  }, [displayedMonth, displayedYear]);

  useEffect(() => {
    updateActiveMonth();
  }, [weekIndex, calendarWeeks, activeMonth]);

  const updateActiveMonth = () => {
    const weeksToDisplay = calendarWeeks.slice(weekIndex, weekIndex + 6);
    const monthCounts = {};

    weeksToDisplay.forEach(week => {
      week.forEach(day => {
        if (monthCounts[day.month]) {
          monthCounts[day.month]++;
        } else {
          monthCounts[day.month] = 1;
        }
      });
    });

    const newActiveMonth = Object.keys(monthCounts).reduce((a, b) => monthCounts[a] > monthCounts[b] ? a : b, null);
    setActiveMonth(Number(newActiveMonth));
    console.log('Active Month:', newActiveMonth);
  };

  const renderDay = (day, month, year) => {
    const isToday = month === currentDate.getMonth() && year === currentDate.getFullYear() && day === currentDate.getDate();
    const isSelected = day === selectedDate.day && month === selectedDate.month && year === selectedDate.year;
    const isActiveMonth = month === activeMonth;
    const className = `${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isActiveMonth ? '' : 'other-month'}`;

    return (
      <td
        key={`${day}-${month}-${year}`}
        onClick={() => handleDayClick(day, month, year)}
        className={className}
      >
        {day}
      </td>
    );
  };

  const renderCalendar = () => {
    const endIndex = weekIndex + 6; // Display 6 weeks
    const weeksToDisplay = calendarWeeks.slice(weekIndex, endIndex);

    const rows = [];
    weeksToDisplay.forEach((week, i) => {
      const cells = week.map((dayObj) => renderDay(dayObj.day, dayObj.month, dayObj.year));
      rows.push(<tr key={i}>{cells}</tr>);
    });

    return rows;
  };

  const handleWheel = (event) => {
    const delta = event.deltaY;
    const maxWeeks = Math.max(calendarWeeks.length - 6, 0);

    if (delta < 0) {
      setWeekIndex(prev => {
        const newIndex = Math.max(prev - 1, 0);
        return newIndex;
      });
    } else if (delta > 0) {
      setWeekIndex(prev => {
        const newIndex = Math.min(prev + 1, maxWeeks);
        return newIndex;
      });
    }
  };

  return (
    <div className="calendar-grid" onWheel={handleWheel}>
      <table className="calendar-table">
        <thead>
          <tr>
            <th>Su</th>
            <th>Mo</th>
            <th>Tu</th>
            <th>We</th>
            <th>Th</th>
            <th>Fr</th>
            <th>Sa</th>
          </tr>
        </thead>
        <tbody>
          {renderCalendar()}
        </tbody>
      </table>
    </div>
  );
};

export default TaskbarCalendarGrid;
