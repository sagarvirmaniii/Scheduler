import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getEvents } from '../services/events';
import { getBookings } from '../services/bookings';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEvents(), getBookings('upcoming')])
      .then(([e, b]) => { setEvents(e.data); setBookings(b.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 lg:p-8 animate-fade-in">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-primary">Welcome back, {user?.name}</h1>
        <p className="text-sm text-ink-secondary mt-1">Here's an overview of your scheduling activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Event Types"       value={events.length}                          to="/event-types" color="blue"  delay="stagger-1"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
        />
        <StatCard label="Upcoming Bookings" value={bookings.length}                        to="/bookings"    color="indigo" delay="stagger-2"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>}
        />
        <StatCard label="Active Events"     value={events.filter(e => e.isActive).length} to="/event-types" color="green" delay="stagger-3"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4-4"/></svg>}
        />
      </div>

      {/* Bookings list */}
      {bookings.length > 0 ? (
        <div className="animate-fade-in-up stagger-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-ink-primary">Upcoming Bookings</h2>
            <Link to="/bookings" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all →</Link>
          </div>
          <div className="space-y-2">
            {bookings.slice(0, 5).map((b, i) => (
              <div
                key={b.id}
                className="bg-surface-card border border-border rounded-xl px-4 lg:px-5 py-3.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:shadow-card-hover hover:border-border-strong animate-fade-in-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
                    {b.guestName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-primary">{b.guestName}</p>
                    <p className="text-xs text-ink-secondary">{b.eventType?.title}</p>
                  </div>
                </div>
                <p className="text-xs text-ink-muted font-medium">{new Date(b.startTime).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface-card border border-border rounded-xl p-10 text-center animate-fade-in-up stagger-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <p className="text-sm text-ink-secondary font-medium">No upcoming bookings yet.</p>
          <Link to="/event-types" className="text-sm text-brand-600 hover:text-brand-700 font-semibold mt-2 inline-block">
            Create an event type to get started →
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, to, color, delay, icon }) {
  const c = {
    blue:   { bg: 'bg-brand-50',   icon: 'text-brand-600',   val: 'text-brand-700'   },
    indigo: { bg: 'bg-indigo-50',  icon: 'text-indigo-600',  val: 'text-indigo-700'  },
    green:  { bg: 'bg-success-bg', icon: 'text-success-icon', val: 'text-success-text' },
  }[color];
  return (
    <Link
      to={to}
      className={`bg-surface-card border border-border rounded-xl px-5 py-5 flex items-center gap-4 hover:shadow-card-hover hover:border-border-strong hover:-translate-y-0.5 animate-fade-in-up ${delay}`}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.bg} ${c.icon}`}>
        {icon}
      </div>
      <div>
        <p className={`text-3xl font-bold ${c.val}`}>{value}</p>
        <p className="text-xs text-ink-secondary font-medium mt-0.5">{label}</p>
      </div>
    </Link>
  );
}
