import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function BookingForm({ onSubmit, loading, error }) {
  const [form, setForm] = useState({ guestName: '', guestEmail: '', notes: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.guestName.trim()) e.guestName = 'Name is required';
    if (!form.guestEmail.trim()) e.guestEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.guestEmail)) e.guestEmail = 'Invalid email';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);
    setErrors({});
    onSubmit(form);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Your Name"      value={form.guestName}  onChange={e => set('guestName', e.target.value)}  error={errors.guestName}  placeholder="Jane Doe" />
      <Input label="Email Address"  type="email" value={form.guestEmail} onChange={e => set('guestEmail', e.target.value)} error={errors.guestEmail} placeholder="jane@example.com" />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-primary">Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          rows={3}
          className="w-full border border-border hover:border-border-strong rounded-lg px-3.5 py-2.5 text-sm text-ink-primary bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-ink-muted resize-none"
          placeholder="Anything you'd like to share…"
        />
      </div>
      {error && <p className="text-sm text-danger-text font-medium">{error}</p>}
      <Button type="submit" loading={loading} className="w-full py-2.5">Confirm Booking</Button>
    </form>
  );
}
