import React from 'react';
import { ShoppingBag, Search, User } from 'lucide-react';

const LuminaNav = ({ tenant }) => {
  return (
    <nav className="h-24 bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-12 lg:px-24 border-b border-slate-100 font-serif">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-bold tracking-[0.2em] uppercase text-slate-900">{tenant?.name || 'LUMINA'}</span>
        <div className="hidden lg:flex items-center gap-8 ml-8">
           {['Shop', 'About', 'Journal'].map(item => (
             <a key={item} href="#" className="text-xs uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors border-b border-transparent hover:border-slate-900 pb-1">{item}</a>
           ))}
        </div>
      </div>

      <div className="flex items-center gap-6 text-slate-400">
        <Search size={18} className="cursor-pointer hover:text-slate-900 transition-colors" />
        <User size={18} className="cursor-pointer hover:text-slate-900 transition-colors" />
        <div className="relative cursor-pointer hover:text-slate-900 transition-colors">
          <ShoppingBag size={18} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-slate-900 text-white text-[8px] flex items-center justify-center rounded-full">0</span>
        </div>
      </div>
    </nav>
  );
};

export default LuminaNav;