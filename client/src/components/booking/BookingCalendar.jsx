import React, { useState } from 'react';
import { getDaysInMonth, getFirstDayOfMonth, toDateString, DAY_NAMES } from '../../utils/date';

export default function BookingCalendar({ activeDays, onSelectDate, selectedDate }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const monthLabel = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = toDateString(today);

  return (
    <div className="bg-surface-card border border-border rounded-xl p-4 lg:p-5 w-full shadow-card">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-subtle text-ink-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="text-sm font-semibold text-ink-primary">{monthLabel}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-subtle text-ink-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-ink-muted py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />;
          const date = new Date(viewYear, viewMonth, day);
          const dateStr = toDateString(date);
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isAvailable = activeDays.includes(date.getDay()) && !isPast;
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={day}
              disabled={!isAvailable}
              onClick={() => onSelectDate(dateStr)}
              className={`aspect-square rounded-lg text-sm font-medium transition-all
                ${isSelected
                  ? 'bg-brand-600 text-white shadow-brand-sm'
                  : isAvailable && isToday
                    ? 'ring-2 ring-brand-400 text-brand-700 font-semibold'
                    : isAvailable
                      ? 'text-ink-primary hover:bg-brand-50 hover:text-brand-700'
                      : 'text-ink-disabled cursor-not-allowed'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
