import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

import DashboardLayout from './pages/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EventTypesPage from './pages/EventTypesPage';
import NewEventTypePage from './pages/NewEventTypePage';
import EditEventTypePage from './pages/EditEventTypePage';
import AvailabilityPage from './pages/AvailabilityPage';
import BookingsPage from './pages/BookingsPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import PublicProfilePage from './pages/PublicProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public booking */}
          <Route path="/book/:slug" element={<BookingPage />} />
          <Route path="/book/:slug/confirmation" element={<ConfirmationPage />} />

          {/* Protected dashboard */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/event-types" element={<EventTypesPage />} />
            <Route path="/event-types/new" element={<NewEventTypePage />} />
            <Route path="/event-types/:id/edit" element={<EditEventTypePage />} />
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
          </Route>

          {/* Public profile — must be last to avoid catching named routes */}
          <Route path="/u/:username" element={<PublicProfilePage />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
