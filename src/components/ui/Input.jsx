import React from 'react';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`flex w-full rounded-md border px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary md:text-sm ${className}`}
      {...props}
    />
  );
}