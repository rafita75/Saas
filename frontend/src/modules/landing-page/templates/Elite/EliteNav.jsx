import React from 'react';
import { Menu, Search } from 'lucide-react';

const EliteNav = ({ tenant }) => {
  return (
    <nav className="h-20 bg-black/95 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-12 border-b border-amber-500/10 font-sans">
      <div className="flex items-center gap-12">
        <span className="text-2xl font-black tracking-tighter uppercase italic text-white">{tenant?.name || 'ELITE'}</span>
        <div className="hidden lg:flex items-center gap-8">
           {['Services', 'Portfolio', 'The Studio', 'Concierge'].map(item => (
             <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-amber-500 transition-all">{item}</a>
           ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button className="hidden md:block px-6 py-2 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all">Book Now</button>
        <Menu className="text-white cursor-pointer hover:text-amber-500 transition-all" size={20} />
      </div>
    </nav>
  );
};

export default EliteNav;