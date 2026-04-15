import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-ink-primary">{label}</label>
      )}
      <input
        {...props}
        className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-ink-primary bg-white outline-none
          placeholder:text-ink-muted
          focus:ring-2 focus:ring-brand-500 focus:border-transparent
          transition-all
          ${error ? 'border-danger-icon' : 'border-border hover:border-border-strong'}
          ${className}`}
      />
      {error && <p className="text-xs text-danger-text font-medium">{error}</p>}
    </div>
  );
}
