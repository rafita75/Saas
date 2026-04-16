import React from 'react';

const LuminaFooter = ({ tenant }) => {
  return (
    <footer className="py-24 px-12 lg:px-24 bg-white border-t border-slate-100 font-serif">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 space-y-8">
           <span className="text-xl font-bold tracking-[0.2em] uppercase text-slate-900">{tenant?.name}</span>
           <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
             Crafting a quieter digital world through intentional design and curated products.
           </p>
        </div>

        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shop</h4>
           <div className="flex flex-col gap-4">
             {['Furniture', 'Lighting', 'Accessories'].map(link => (
               <a key={link} href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{link}</a>
             ))}
           </div>
        </div>

        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company</h4>
           <div className="flex flex-col gap-4">
             {['Privacy', 'Terms', 'Returns'].map(link => (
               <a key={link} href="#" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{link}</a>
             ))}
           </div>
        </div>

        <div className="space-y-6 text-right">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</h4>
           <p className="text-sm text-slate-600">London · Tokyo · New York</p>
        </div>
      </div>

      <div className="mt-24 pt-8 border-t border-slate-50 flex items-center justify-center">
         <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-300">© 2026 {tenant?.name}. Precision in every detail.</p>
      </div>
    </footer>
  );
};

export default LuminaFooter;