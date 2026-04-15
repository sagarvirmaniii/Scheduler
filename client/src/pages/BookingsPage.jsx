import React, { useEffect, useState } from 'react';
import { getBookings, cancelBooking } from '../services/bookings';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { formatDateTime } from '../utils/date';

export default function BookingsPage() {
  const [filter, setFilter] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = (f) => {
    setLoading(true);
    getBookings(f).then(r => setBookings(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(filter); }, [filter]);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await cancelBooking(id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
  };

  const statusColor = s => ({ CONFIRMED: 'green', CANCELLED: 'red', RESCHEDULED: 'blue' }[s] || 'gray');

  return (
    <div className="p-4 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-primary">Bookings</h1>
        <p className="text-sm text-ink-secondary mt-1">View and manage your scheduled meetings.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {['upcoming', 'past'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? 'bg-brand-600 text-white shadow-brand-sm'
                : 'bg-surface-card border border-border text-ink-secondary hover:bg-surface-subtle'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : bookings.length === 0 ? (
        <div className="bg-surface-card border border-border rounded-xl text-center py-16 animate-fade-in-up">
          <p className="text-sm text-ink-secondary font-medium">No {filter} bookings.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookings.map((b, i) => (
            <div
              key={b.id}
              className="bg-surface-card border border-border rounded-xl px-4 lg:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-card-hover hover:border-border-strong animate-fade-in-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
                  {b.guestName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-ink-primary text-sm">{b.guestName}</p>
                    <Badge color={statusColor(b.status)}>{b.status}</Badge>
                  </div>
                  <p className="text-xs text-ink-secondary">{b.guestEmail}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{b.eventType?.title} · {formatDateTime(b.startTime)}</p>
                  {b.notes && <p className="text-xs text-ink-muted mt-1 italic">"{b.notes}"</p>}
                </div>
              </div>
              {b.status === 'CONFIRMED' && filter === 'upcoming' && (
                <Button variant="danger" onClick={() => handleCancel(b.id)}>Cancel</Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
