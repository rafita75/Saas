import React from 'react';

const EliteFooter = ({ tenant }) => {
  return (
    <footer className="py-24 bg-black border-t border-amber-500/10 font-sans">
      <div className="max-w-7xl mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="col-span-2 space-y-8">
           <span className="text-3xl font-black tracking-tighter uppercase italic text-white">{tenant?.name}</span>
           <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
             Setting the editorial standard for excellence. Bespoke services for the modern collector.
           </p>
        </div>

        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Legal</h4>
           <div className="flex flex-col gap-4">
             {['Privacy Policy', 'Terms of Service', 'Sustainability'].map(link => (
               <a key={link} href="#" className="text-xs text-slate-400 hover:text-white transition-all uppercase tracking-widest">{link}</a>
             ))}
           </div>
        </div>

        <div className="space-y-6 text-right">
           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Contact</h4>
           <p className="text-xs text-slate-400 uppercase tracking-widest">Beverly Hills · Monaco · Dubai</p>
        </div>
      </div>

      <div className="mt-24 pt-8 border-t border-white/5 flex items-center justify-center">
         <p className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-600">© 2026 {tenant?.name}. The Editorial Standard.</p>
      </div>
    </footer>
  );
};

export default EliteFooter;