import React from 'react';

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none h-9 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}