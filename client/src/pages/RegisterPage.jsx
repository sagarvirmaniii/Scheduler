import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function RegisterPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await register(form);
      signIn(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-page flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-[400px] animate-fade-in-up">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand-sm shrink-0">
            <svg width="17" height="17" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M8 2v4M16 2v4M3 10h18" />
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" strokeWidth={2.5} />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-[17px] font-bold text-ink-primary tracking-tight">Scheduler</p>
            <p className="text-[10px] font-semibold text-ink-muted tracking-widest uppercase">Platform</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-ink-primary mb-1">Create your account</h1>
        <p className="text-sm text-ink-secondary mb-7">Start scheduling in minutes — it's free.</p>

        <div className="bg-surface-card border border-border rounded-xl p-6 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name"      value={form.name}     onChange={e => set('name', e.target.value)}     placeholder="Jane Doe" />
            <Input label="Email address"  type="email" value={form.email}    onChange={e => set('email', e.target.value)}    placeholder="jane@example.com" />
            <Input label="Username"       value={form.username} onChange={e => set('username', e.target.value)} placeholder="janedoe" />
            <Input label="Password"       type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" />
            {error && <p className="text-sm text-danger-text font-medium">{error}</p>}
            <Button type="submit" loading={loading} className="w-full py-2.5">Create Account</Button>
          </form>
        </div>

        <p className="text-sm text-center text-ink-secondary mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
