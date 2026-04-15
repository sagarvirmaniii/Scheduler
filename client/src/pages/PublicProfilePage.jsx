import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPublicUserEvents } from '../services/events';
import Spinner from '../components/ui/Spinner';

const LogoIcon = () => (
  <svg width="17" height="17" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" strokeWidth={2.5} />
  </svg>
);

export default function PublicProfilePage() {
  const { username } = useParams();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicUserEvents(username)
      .then(r => { setEvents(r.data.events); setUser(r.data.user); })
      .catch(() => setError('Profile not found.'))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface-page"><Spinner /></div>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page animate-fade-in">
      <div className="text-center">
        <p className="text-ink-secondary font-medium">{error}</p>
        <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold text-sm mt-2 inline-block">Go to login</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-page">

      {/* ── Top bar — same bg as page, logo top-left ── */}
      <div className="px-4 lg:px-8 pt-6 pb-0">
        <Link to="/dashboard" className="flex items-center gap-3 group w-fit">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand-sm group-hover:bg-brand-700 transition-colors shrink-0">
            <LogoIcon />
          </div>
          <div className="leading-tight">
            <p className="text-[17px] font-bold text-ink-primary tracking-tight">Scheduler</p>
            <p className="text-[10px] font-semibold text-ink-muted tracking-widest uppercase">Scheduling Platform</p>
          </div>
        </Link>
      </div>

      {/* ── Profile header ── */}
      <div className="max-w-2xl mx-auto px-4 lg:px-6 pt-8 pb-6 text-center animate-fade-in-up">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-lg mx-auto mb-3">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <h1 className="text-xl font-bold text-ink-primary mb-1">{user?.name}</h1>
        <p className="text-sm text-ink-secondary">Pick a time that works for you.</p>
        <div className="inline-flex items-center gap-1.5 mt-3 bg-brand-50 border border-brand-200 rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-success-icon animate-pulse" />
          <span className="text-brand-700 text-xs font-semibold">
            {events.length} event{events.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>

      {/* ── Events ── */}
      <div className="max-w-2xl mx-auto px-4 lg:px-6 pb-12">
        {events.length === 0 ? (
          <div className="bg-surface-card border border-border rounded-xl text-center py-14 shadow-card animate-fade-in-up">
            <p className="text-ink-secondary font-medium">No events available for booking right now.</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">Choose an event</p>
            <div className="space-y-3">
              {events.map((event, i) => (
                <Link
                  key={event.id}
                  to={`/book/${event.slug}`}
                  className="group flex items-center gap-5 bg-surface-card border border-border rounded-xl px-6 py-5 hover:shadow-card-hover hover:border-brand-300 hover:-translate-y-0.5 animate-fade-in-up shadow-card"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-brand-sm group-hover:bg-brand-700 transition-colors">
                    {event.duration}m
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-primary text-base group-hover:text-brand-700 transition-colors leading-tight">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-sm text-ink-secondary mt-0.5 truncate">{event.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-ink-secondary bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
                        </svg>
                        {event.duration} min
                      </span>
                      {event.bufferTime > 0 && (
                        <span className="text-xs font-medium text-ink-muted bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
                          {event.bufferTime}m buffer
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 group-hover:bg-brand-600 group-hover:border-brand-600 flex items-center justify-center shrink-0 transition-all">
                    <svg className="w-4 h-4 text-brand-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <p className="text-center text-xs text-ink-muted mt-10">
          Powered by{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">Scheduler</Link>
        </p>
      </div>
    </div>
  );
}
