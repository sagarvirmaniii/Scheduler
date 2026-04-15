import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/dashboard/Sidebar';
import Spinner from '../components/ui/Spinner';

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface-page"><Spinner /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="flex h-screen bg-surface-page overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        {/* Username top-right — desktop only */}
        {user && (
          <div className="hidden lg:flex items-center justify-end px-6 pt-4 pb-0 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-ink-secondary">{user.name}</span>
            </div>
          </div>
        )}
        {/* Mobile top bar spacer */}
        <div className="lg:hidden h-14 shrink-0" />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
