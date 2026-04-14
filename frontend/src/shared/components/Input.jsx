import { forwardRef } from 'react';

export const Input = forwardRef(({ 
  label, 
  type = 'text', 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 transition-colors peer-focus:text-primary" />
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full bg-dark-800/50 border border-slate-700 rounded-xl
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3
            text-slate-200 placeholder-slate-600
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
            hover:border-slate-600
            transition-all duration-200
            ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
          <span className="inline-block w-1 h-1 bg-red-400 rounded-full" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';