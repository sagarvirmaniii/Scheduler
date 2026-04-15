import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { formatDateTime } from '../utils/date';

export default function ConfirmationPage() {
  const { state } = useLocation();

  if (!state?.booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-page">
        <div className="text-center animate-fade-in-up">
          <p className="text-ink-secondary font-medium mb-2">No booking found.</p>
          <Link to="/" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">Go home</Link>
        </div>
      </div>
    );
  }

  const { booking, event } = state;

  return (
    <div className="min-h-screen bg-surface-page flex flex-col">
      {/* Logo bar — sits on page bg, no white header */}
      <div className="px-4 lg:px-8 pt-6 pb-0">
        <Link to="/dashboard" className="flex items-center gap-3 group w-fit">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand-sm group-hover:bg-brand-700 transition-colors shrink-0">
            <svg width="17" height="17" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M8 2v4M16 2v4M3 10h18" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" strokeWidth={2.5} />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-[17px] font-bold text-ink-primary tracking-tight">Scheduler</p>
            <p className="text-[10px] font-semibold text-ink-muted tracking-widest uppercase">Scheduling Platform</p>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-surface-card border border-border rounded-xl p-8 max-w-md w-full text-center shadow-card animate-fade-in-up">
          <div className="w-14 h-14 bg-success-bg border border-success-border rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-success-icon" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-ink-primary mb-1">Booking Confirmed</h1>
          <p className="text-sm text-ink-secondary mb-6">
            A confirmation has been sent to <span className="font-semibold text-ink-primary">{booking.guestEmail}</span>
          </p>

          <div className="bg-surface-page border border-border rounded-lg p-4 text-left space-y-3 mb-6">
            <Row label="Event" value={event?.title} />
            <Row label="When"  value={formatDateTime(booking.startTime)} />
            <Row label="Name"  value={booking.guestName} />
            <Row label="Email" value={booking.guestEmail} />
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-semibold"
          >
            Book another meeting
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-ink-secondary">{label}</span>
      <span className="font-semibold text-ink-primary">{value}</span>
    </div>
  );
}
