import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { createEvent, updateEvent } from '../../services/events';

export default function EventTypeForm({ initial }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    duration: initial?.duration || 30,
    bufferTime: initial?.bufferTime || 0,
    isActive: initial?.isActive ?? true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError('Title is required');
    if (!form.duration || form.duration < 5) return setError('Duration must be at least 5 minutes');
    setError(''); setLoading(true);
    try {
      initial ? await updateEvent(initial.id, form) : await createEvent(form);
      navigate('/event-types');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg animate-fade-in-up">
      <Input label="Title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="30 Minute Meeting" />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-primary">Description</label>
        <textarea
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={3}
          className="w-full border border-border hover:border-border-strong rounded-lg px-3.5 py-2.5 text-sm text-ink-primary bg-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-ink-muted resize-none"
          placeholder="Optional description"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Duration (minutes)"    type="number" min={5} value={form.duration}   onChange={e => set('duration',   parseInt(e.target.value))} />
        <Input label="Buffer Time (minutes)" type="number" min={0} value={form.bufferTime} onChange={e => set('bufferTime', parseInt(e.target.value))} />
      </div>
      {initial && (
        <label className="flex items-center gap-2.5 text-sm text-ink-primary cursor-pointer font-medium">
          <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 rounded accent-brand-600" />
          Active
        </label>
      )}
      {error && <p className="text-sm text-danger-text font-medium">{error}</p>}
      <div className="flex gap-3 pt-1">
        <Button type="submit" loading={loading}>{initial ? 'Save Changes' : 'Create Event Type'}</Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/event-types')}>Cancel</Button>
      </div>
    </form>
  );
}
