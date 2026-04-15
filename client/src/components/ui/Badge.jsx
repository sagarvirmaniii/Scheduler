import React from 'react';

const colors = {
  green: 'bg-success-bg text-success-text border border-success-border',
  red:   'bg-danger-bg  text-danger-text  border border-danger-border',
  blue:  'bg-info-bg    text-info-text    border border-info-border',
  gray:  'bg-surface-subtle text-ink-secondary border border-border',
};

export default function Badge({ children, color = 'gray' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}
