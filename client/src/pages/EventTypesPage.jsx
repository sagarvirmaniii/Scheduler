import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent, updateEvent } from '../services/events';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';

export default function EventTypesPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  const load = () => getEvents().then(r => setEvents(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this event type?')) return;
    await deleteEvent(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const toggleActive = async (event) => {
    const updated = await updateEvent(event.id, { isActive: !event.isActive });
    setEvents(prev => prev.map(e => e.id === event.id ? updated.data : e));
  };

  const copyLink = (slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 lg:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary">Event Types</h1>
          <p className="text-sm text-ink-secondary mt-1">Manage your bookable event types.</p>
        </div>
        <Link to="/event-types/new"><Button>+ New Event Type</Button></Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-surface-card border border-border rounded-xl text-center py-16 animate-fade-in-up">
          <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <p className="text-sm text-ink-secondary font-medium">No event types yet.</p>
          <Link to="/event-types/new" className="text-sm text-brand-600 hover:text-brand-700 font-semibold mt-2 inline-block">
            Create your first event type →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map((event, i) => (
            <div
              key={event.id}
              className="bg-surface-card border border-border rounded-xl px-4 lg:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-card-hover hover:border-border-strong animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
                  {event.duration}m
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-ink-primary">{event.title}</p>
                    <Badge color={event.isActive ? 'green' : 'gray'}>{event.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  {event.description && <p className="text-sm text-ink-secondary">{event.description}</p>}
                  <p className="text-xs text-ink-muted mt-0.5 font-mono">
                    /book/{event.slug} · {event.bufferTime > 0 ? `${event.bufferTime}m buffer` : 'No buffer'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <Button variant="ghost" onClick={() => copyLink(event.slug)}>
                  {copied === event.slug ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button variant="ghost" onClick={() => toggleActive(event)}>
                  {event.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Link to={`/event-types/${event.id}/edit`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button variant="danger" onClick={() => handleDelete(event.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
