import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const CalIcon = ({ size = 20 }) => (
  <svg width={size} height={size} fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" strokeWidth={2.5} />
  </svg>
);

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      signIn(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'admin@scheduler.com', password: 'admin123' });

  return (
    <div className="min-h-screen bg-surface-page flex flex-col lg:flex-row">

      {/* ── Left panel ── */}
      <div
        className="lg:w-[420px] lg:shrink-0 flex flex-col justify-between p-8 lg:p-12 py-10"
        style={{ background: 'linear-gradient(160deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)' }}
      >
        {/* Logo — bigger */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
            <CalIcon size={24} />
          </div>
          <div className="leading-tight">
            <p className="text-2xl font-bold text-white tracking-tight">Scheduler</p>
            <p className="text-[11px] font-semibold text-blue-100 tracking-widest uppercase">Scheduling Platform</p>
          </div>
        </div>

        <div className="mt-10 lg:mt-0">
          <h2 className="text-2xl lg:text-[28px] font-bold text-white leading-snug mb-3">
            Scheduling made<br className="hidden lg:block" /> simple and smart.
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Share your booking link, let others pick a time, and never worry about back-and-forth emails again.
          </p>
          <div className="mt-6 space-y-3">
            {['No double bookings', 'Custom availability', 'Instant confirmations'].map(f => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-white">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-100 text-xs mt-8 lg:mt-0">&copy; {new Date().getFullYear()} Scheduler</p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-[400px] animate-fade-in-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shrink-0">
              <CalIcon size={18} />
            </div>
            <div className="leading-tight">
              <p className="text-xl font-bold text-ink-primary tracking-tight">Scheduler</p>
              <p className="text-[10px] font-semibold text-ink-muted tracking-widest uppercase">Scheduling Platform</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-ink-primary mb-1">Sign in to Scheduler</h1>
          <p className="text-sm text-ink-secondary mb-6">Enter your credentials to access your dashboard.</p>

          {/* Demo credentials */}
          <div className="flex items-center justify-between bg-info-bg border border-info-border rounded-xl px-4 py-3.5 mb-6">
            <div>
              <p className="text-xs font-semibold text-info-text uppercase tracking-wide mb-1">Demo Account</p>
              <p className="text-sm text-ink-primary font-medium">admin@scheduler.com</p>
              <p className="text-xs text-ink-secondary mt-0.5">Password: admin123</p>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-3.5 py-2 rounded-lg transition-all shadow-brand-sm hover:-translate-y-px shrink-0 ml-3"
            >
              Use Demo
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@scheduler.com" />
            <Input label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            {error && <p className="text-sm text-danger-text font-medium">{error}</p>}
            <Button type="submit" loading={loading} className="w-full py-2.5 text-sm">Sign In</Button>
          </form>

          <p className="text-sm text-center text-ink-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
