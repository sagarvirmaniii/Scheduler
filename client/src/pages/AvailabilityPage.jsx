import React, { useEffect, useState } from 'react';
import { getAvailability, saveAvailability } from '../services/availability';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { FULL_DAY_NAMES } from '../utils/date';

const DEFAULT_SLOTS = [{ startTime: '09:00', endTime: '17:00' }];

export default function AvailabilityPage() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAvailability().then(r => {
      const map = {};
      r.data.forEach(d => { map[d.dayOfWeek] = d; });
      setDays(Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i,
        isActive: map[i]?.isActive ?? false,
        timeSlots: map[i]?.timeSlots?.length ? map[i].timeSlots : [...DEFAULT_SLOTS],
      })));
    }).finally(() => setLoading(false));
  }, []);

  const toggleDay = i => setDays(prev => prev.map((d, idx) => idx === i ? { ...d, isActive: !d.isActive } : d));

  const updateSlot = (di, si, field, val) =>
    setDays(prev => prev.map((d, i) => i !== di ? d : {
      ...d, timeSlots: d.timeSlots.map((s, j) => j === si ? { ...s, [field]: val } : s)
    }));

  const addSlot = di =>
    setDays(prev => prev.map((d, i) => i !== di ? d : { ...d, timeSlots: [...d.timeSlots, { startTime: '09:00', endTime: '17:00' }] }));

  const removeSlot = (di, si) =>
    setDays(prev => prev.map((d, i) => i !== di ? d : { ...d, timeSlots: d.timeSlots.filter((_, j) => j !== si) }));

  const handleSave = async () => {
    setSaving(true);
    try { await saveAvailability(days); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 lg:p-8 animate-fade-in">
      <div className="max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink-primary">Availability</h1>
            <p className="text-sm text-ink-secondary mt-1">Set your weekly available hours.</p>
          </div>
          <Button onClick={handleSave} loading={saving}>{saved ? 'Saved!' : 'Save Changes'}</Button>
        </div>

        <div className="space-y-2">
          {days.map((day, i) => (
            <div
              key={i}
              className="bg-surface-card border border-border rounded-xl px-5 py-4 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={day.isActive}
                  onChange={() => toggleDay(i)}
                  className="w-4 h-4 rounded accent-brand-600 cursor-pointer"
                />
                <span className="text-sm font-semibold text-ink-primary w-28">{FULL_DAY_NAMES[i]}</span>
                {!day.isActive && <span className="text-xs text-ink-muted">Unavailable</span>}
              </div>
              {day.isActive && (
                <div className="ml-7 space-y-2">
                  {day.timeSlots.map((slot, j) => (
                    <div key={j} className="flex flex-wrap items-center gap-2">
                      <input type="time" value={slot.startTime} onChange={e => updateSlot(i, j, 'startTime', e.target.value)}
                        className="border border-border rounded-lg px-3 py-2 text-sm text-ink-primary bg-surface-subtle focus:ring-2 focus:ring-brand-500 outline-none" />
                      <span className="text-ink-muted text-sm">–</span>
                      <input type="time" value={slot.endTime} onChange={e => updateSlot(i, j, 'endTime', e.target.value)}
                        className="border border-border rounded-lg px-3 py-2 text-sm text-ink-primary bg-surface-subtle focus:ring-2 focus:ring-brand-500 outline-none" />
                      {day.timeSlots.length > 1 && (
                        <button onClick={() => removeSlot(i, j)} className="text-ink-muted hover:text-danger-text transition-colors text-lg leading-none">&times;</button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => addSlot(i)} className="text-xs text-brand-600 hover:text-brand-700 font-semibold">
                    + Add time range
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
