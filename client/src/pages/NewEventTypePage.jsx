import React from 'react';
import EventTypeForm from '../components/dashboard/EventTypeForm';

export default function NewEventTypePage() {
  return (
    <div className="p-4 lg:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-primary">New Event Type</h1>
        <p className="text-sm text-ink-secondary mt-1">Create a new bookable event type.</p>
      </div>
      <EventTypeForm />
    </div>
  );
}
