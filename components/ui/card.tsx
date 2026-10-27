import React from 'react';

export function Card({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-2xl border border-slate-200/80 bg-white dark:bg-slate-900/80 dark:border-slate-800 shadow-sm transition-all hover:shadow-md ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ className = '', children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-semibold tracking-tight ${className}`} {...props}>{children}</h3>;
}

export function CardContent({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 pt-0 ${className}`} {...props}>{children}</div>;
}

export function CardFooter({ className = '', children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`p-5 pt-0 flex items-center ${className}`} {...props}>{children}</div>;
}

