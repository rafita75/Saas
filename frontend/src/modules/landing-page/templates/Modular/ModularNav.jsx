import React from 'react';
import { Building2, Menu } from 'lucide-react';

const ModularNav = ({ tenant, menu = [], isEditor = false }) => {
  return (
    <nav className="h-28 border-b border-slate-100 flex items-center justify-between px-8 lg:px-20 bg-white/80 backdrop-blur-3xl sticky top-0 z-50 transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 border border-indigo-400">
          {tenant?.logo ? <img src={tenant.logo} alt={tenant.name} className="w-full h-full object-cover" /> : <Building2 className="text-white w-8 h-8" />}
        </div>
        <span className="font-bold text-3xl tracking-tighter text-slate-900">{tenant?.name}</span>
      </div>

      <div className="hidden lg:flex items-center gap-12">
        <div className="flex items-center gap-8">
          {['Soluciones', 'Metodología', 'Planes', 'Recursos'].map((item) => (
            <a key={item} href="#" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">{item}</a>
          ))}
        </div>
        <div className="h-8 w-px bg-slate-200 mx-2" />
        <div className="flex items-center gap-6">
          <button className="text-sm font-bold text-slate-900 uppercase tracking-widest hover:text-indigo-600">Login</button>
          <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">Comenzar</button>
        </div>
      </div>

      <button className="lg:hidden p-4 bg-slate-50 rounded-2xl"><Menu size={24} /></button>
    </nav>
  );
};

export default ModularNav;