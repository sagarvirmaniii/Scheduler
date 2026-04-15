import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const CalIcon = () => (
  <svg width="20" height="20" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M8 2v4M16 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeLinecap="round" strokeWidth={2.5} />
  </svg>
);
const DashboardIcon = () => (
  <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const EventIcon = () => (
  <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
  </svg>
);
const BookingsIcon = () => (
  <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" />
  </svg>
);
const GlobeIcon = () => (
  <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);
const SignOutIcon = () => (
  <svg className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
  </svg>
);

const links = [
  { to: '/dashboard',    label: 'Dashboard',    Icon: DashboardIcon },
  { to: '/event-types',  label: 'Event Types',  Icon: EventIcon },
  { to: '/availability', label: 'Availability', Icon: ClockIcon },
  { to: '/bookings',     label: 'Bookings',     Icon: BookingsIcon },
];

const SidebarContent = ({ user, handleSignOut, onClose }) => (
  <>
    {/* Logo */}
    <div className="px-6 py-5 border-b border-blue-200">
      <Link to="/dashboard" onClick={onClose} className="flex items-center gap-3.5 group w-fit">
        <div className="w-11 h-11 rounded-xl bg-brand-600 flex items-center justify-center shadow-brand-sm group-hover:bg-brand-700 transition-colors shrink-0">
          <CalIcon />
        </div>
        <div className="leading-tight">
          <p className="text-[20px] font-bold text-ink-primary tracking-tight">Scheduler</p>
          <p className="text-[10px] font-semibold text-ink-muted tracking-widest uppercase">Scheduling Platform</p>
        </div>
      </Link>
    </div>

    {/* Nav */}
    <nav className="flex-1 px-4 py-5 space-y-1">
      {links.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-brand-600 text-white font-semibold shadow-brand-sm'
                : 'text-ink-secondary hover:bg-blue-100 hover:text-ink-primary'
            }`
          }
        >
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>

    {/* Footer */}
    <div className="px-4 py-5 border-t border-blue-200 space-y-1">
      {user?.username && (
        <Link
          to={`/u/${user.username}`}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-all"
        >
          <GlobeIcon />
          My Public Booking
        </Link>
      )}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink-secondary hover:bg-danger-bg hover:text-danger-text rounded-xl transition-all font-medium"
      >
        <SignOutIcon />
        Sign out
      </button>
    </div>
  </>
);

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = () => { signOut(); navigate('/login'); };
  const close = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#DBEAFE] border-b border-blue-200 flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
            <svg width="15" height="15" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" />
              <path d="M8 14h.01M12 14h.01M16 14h.01" strokeLinecap="round" strokeWidth={2.5} />
            </svg>
          </div>
          <span className="text-base font-bold text-ink-primary tracking-tight">Scheduler</span>
        </Link>
        <button onClick={() => setMobileOpen(o => !o)} className="p-2 rounded-lg hover:bg-blue-100 transition-colors">
          {mobileOpen ? (
            <svg className="w-5 h-5 text-ink-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-ink-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/30" onClick={close} />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 z-40 bg-[#DBEAFE] flex flex-col transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent user={user} handleSignOut={handleSignOut} onClose={close} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-72 h-full bg-[#DBEAFE] border-r border-blue-200 flex-col animate-slide-in-left">
        <SidebarContent user={user} handleSignOut={handleSignOut} onClose={() => {}} />
      </aside>
    </>
  );
}
