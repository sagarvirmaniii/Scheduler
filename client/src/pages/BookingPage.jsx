import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPublicEvent } from '../services/events';
import { getPublicAvailability } from '../services/availability';
import { getSlots } from '../services/slots';
import { createBooking } from '../services/bookings';
import BookingCalendar from '../components/booking/BookingCalendar';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import BookingForm from '../components/booking/BookingForm';
import Spinner from '../components/ui/Spinner';
import { formatDate, formatTime } from '../utils/date';

export default function BookingPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [activeDays, setActiveDays] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    Promise.all([getPublicEvent(slug), getPublicAvailability(slug)])
      .then(([eRes, aRes]) => { setEvent(eRes.data); setActiveDays(aRes.data.map(d => d.dayOfWeek)); })
      .catch(() => setPageError('Event not found or no longer available.'))
      .finally(() => setPageLoading(false));
  }, [slug]);

  const handleDateSelect = async (date) => {
    setSelectedDate(date); setSelectedSlot(null); setSlots([]); setSlotsLoading(true);
    try { const res = await getSlots(event.id, date); setSlots(res.data); }
    finally { setSlotsLoading(false); }
    setStep(1);
  };

  const handleSlotSelect = (slot) => { setSelectedSlot(slot); setStep(2); };

  const handleBook = async (formData) => {
    setBookingError(''); setBookingLoading(true);
    try {
      const res = await createBooking({ eventTypeId: event.id, startTime: selectedSlot.start, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, ...formData });
      navigate(`/book/${slug}/confirmation`, { state: { booking: res.data, event, slot: selectedSlot } });
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally { setBookingLoading(false); }
  };

  if (pageLoading) return <div className="min-h-screen flex items-center justify-center bg-surface-page"><Spinner /></div>;
  if (pageError)  return <div className="min-h-screen flex items-center justify-center bg-surface-page text-ink-secondary animate-fade-in">{pageError}</div>;

  return (
    <div className="min-h-screen bg-surface-page animate-fade-in">

      {/* Logo bar — sits on page bg, no white header */}
      <div className="px-4 lg:px-8 pt-6 pb-0">
        <Link to={`/u/${event.user?.username}`} className="flex items-center gap-3 group w-fit">
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

      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-8">

        {/* Event header card */}
        <div className="bg-surface-card border border-border rounded-xl px-6 py-5 mb-6 shadow-card animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-brand-sm">
              {event.duration}m
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink-primary">{event.title}</h1>
              <p className="text-sm text-ink-secondary mt-0.5">
                with <span className="font-semibold text-ink-primary">{event.user?.name}</span>
                <span className="mx-2 text-border-strong">·</span>
                <span>{event.duration} minutes</span>
              </p>
              {event.description && <p className="text-sm text-ink-secondary mt-1">{event.description}</p>}
            </div>
          </div>
        </div>

        {/* Calendar + panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="animate-fade-in-up stagger-1">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-3">Select a date</p>
            <BookingCalendar activeDays={activeDays} selectedDate={selectedDate} onSelectDate={handleDateSelect} />
          </div>

          <div className="bg-surface-card border border-border rounded-xl p-5 shadow-card animate-fade-in-up stagger-2">
            {step === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-ink-muted py-12 gap-3">
                <svg className="w-9 h-9 text-border-strong" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
                </svg>
                <p className="text-sm font-medium">Select a date to see available times</p>
              </div>
            )}

            {step >= 1 && step < 2 && (
              <>
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-widest mb-4">
                  {formatDate(selectedDate + 'T00:00:00')}
                </p>
                <TimeSlotPicker slots={slots} selectedSlot={selectedSlot} onSelect={handleSlotSelect} loading={slotsLoading} />
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-5 p-3.5 bg-info-bg border border-info-border rounded-lg">
                  <p className="text-sm font-semibold text-info-text">{formatDate(selectedDate + 'T00:00:00')}</p>
                  <p className="text-sm text-brand-600 mt-0.5">{formatTime(selectedSlot.start)} – {formatTime(selectedSlot.end)}</p>
                  <button onClick={() => setStep(1)} className="text-xs text-brand-600 hover:text-brand-700 font-semibold mt-1.5">
                    ← Change time
                  </button>
                </div>
                <BookingForm onSubmit={handleBook} loading={bookingLoading} error={bookingError} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
