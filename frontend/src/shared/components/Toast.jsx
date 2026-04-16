import { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle2 },
    error: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', icon: XCircle },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: AlertCircle },
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: Info },
  };

  const { bg, border, text, icon: Icon } = styles[type] || styles.info;

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-4 px-6 py-4 rounded-2xl border ${bg} ${border} ${text} backdrop-blur-xl shadow-2xl animate-in slide-in-from-right duration-300`}>
      <Icon size={20} />
      <span className="text-sm font-bold">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;