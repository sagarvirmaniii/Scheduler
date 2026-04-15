import React from 'react';

const variants = {
  primary:   'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-brand-sm hover:shadow-brand-md',
  secondary: 'bg-white hover:bg-surface-hover text-ink-secondary border border-border shadow-card hover:border-border-strong',
  danger:    'bg-danger-icon hover:bg-danger-text text-white shadow-sm',
  ghost:     'text-ink-secondary hover:bg-surface-subtle hover:text-ink-primary',
};

export default function Button({ children, variant = 'primary', className = '', loading, ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${variants[variant]} ${className}`}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}
