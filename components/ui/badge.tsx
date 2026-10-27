import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline';
}

export function Badge({ className = '', variant = 'default', children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-transparent',
    secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-transparent',
    outline: 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
  }[variant];

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

