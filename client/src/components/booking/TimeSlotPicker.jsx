import React from 'react';
import { formatTime } from '../../utils/date';

export default function TimeSlotPicker({ slots, selectedSlot, onSelect, loading }) {
  if (loading) return (
    <div className="flex items-center gap-2 text-sm text-ink-secondary py-6">
      <span className="w-4 h-4 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      Loading available times…
    </div>
  );
  if (!slots.length) return (
    <p className="text-sm text-ink-secondary py-6">No available slots for this day.</p>
  );

  return (
    <div className="grid grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
      {slots.map(slot => {
        const isSelected = selectedSlot?.start === slot.start;
        return (
          <button
            key={slot.start}
            onClick={() => onSelect(slot)}
            className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all hover:-translate-y-px
              ${isSelected
                ? 'bg-brand-600 text-white border-brand-600 shadow-brand-sm'
                : 'border-border text-ink-primary hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700'
              }`}
          >
            {formatTime(slot.start)}
          </button>
        );
      })}
    </div>
  );
}
