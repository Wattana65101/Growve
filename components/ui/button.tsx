import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function Button({ className = '', size = 'default', variant = 'default', children, ...props }: ButtonProps) {
  const sizeStyles = {
    sm: 'h-9 px-3 text-xs',
    default: 'h-11 px-5 text-sm',
    lg: 'h-12 px-8 text-base font-medium'
  }[size];

  const variantStyles = {
    default: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow active:scale-[0.98]',
    outline: 'border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100',
    ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

