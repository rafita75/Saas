import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const PasswordInput = forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`
            w-full bg-dark-800/50 border border-slate-700 rounded-xl
            pl-4 pr-12 py-3
            text-slate-200 placeholder-slate-600
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
            hover:border-slate-600
            transition-all duration-200
            ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-dark-700/50 transition-all"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
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

PasswordInput.displayName = 'PasswordInput';