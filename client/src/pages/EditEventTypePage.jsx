import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEvents } from '../services/events';
import EventTypeForm from '../components/dashboard/EventTypeForm';
import Spinner from '../components/ui/Spinner';

export default function EditEventTypePage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(r => {
      setEvent(r.data.find(e => e.id === id) || null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!event) return <div className="p-8 text-ink-secondary text-sm">Event type not found.</div>;

  return (
    <div className="p-4 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-primary">Edit Event Type</h1>
        <p className="text-sm text-ink-secondary mt-1">Update your event type details.</p>
      </div>
      <EventTypeForm initial={event} />
    </div>
  );
}
