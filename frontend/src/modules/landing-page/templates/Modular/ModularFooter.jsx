import React from 'react';
import { Sparkles } from 'lucide-react';

const ModularFooter = ({ tenant }) => {
  return (
    <footer className="py-24 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-20 grid grid-cols-1 md:grid-cols-4 gap-16">
        
        <div className="col-span-2 space-y-8">
          <div className="flex items-center gap-4">
            <span className="font-bold text-2xl tracking-tighter text-slate-900">{tenant?.name}</span>
          </div>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
            © 2026 {tenant?.name}. Elevando la precisión digital. Todos los derechos reservados.
          </p>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Plataforma</h4>
          <div className="flex flex-col gap-4">
            {['Privacidad', 'Términos', 'Cookies'].map(link => (
              <a key={link} href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all">{link}</a>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Empresa</h4>
          <div className="flex flex-col gap-4">
            {['Contacto', 'Carreras', 'Blog'].map(link => (
              <a key={link} href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-all">{link}</a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 lg:px-20 mt-24 flex items-center justify-center gap-3">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-3">
          Powered by <Sparkles size={14} className="text-indigo-600" /> ModularBusiness
        </p>
      </div>
    </footer>
  );
};

export default ModularFooter;