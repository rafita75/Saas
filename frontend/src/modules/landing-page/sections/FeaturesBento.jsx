import React from 'react';
import { Zap, ShieldCheck, Rocket, Layout, Globe, MessageSquare, ArrowRight } from 'lucide-react';

/**
 * FeaturesBento: Diseño de cuadrícula asimétrica premium.
 */
const FeaturesBento = ({ content, isPreview = false }) => {
  const { 
    title = 'Excelencia en cada detalle',
    description = 'Nuestro enfoque combina diseño de clase mundial con ingeniería de precisión.',
    items = []
  } = content;

  const icons = [Zap, ShieldCheck, Rocket, Layout, Globe, MessageSquare];

  return (
    <div className="max-w-7xl mx-auto py-24 lg:py-48 px-8 space-y-24">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
          {title}
        </h2>
        <div className="w-32 h-1.5 bg-primary mx-auto rounded-full shadow-lg shadow-primary/20" />
        <p className="text-slate-400 text-xl font-medium leading-relaxed italic">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 lg:gap-8 auto-rows-[300px] lg:auto-rows-[350px]">
        {items.slice(0, 5).map((item, i) => {
          const gridClasses = [
            'md:col-span-3 md:row-span-2', 
            'md:col-span-3 md:row-span-1', 
            'md:col-span-3 md:row-span-1', 
            'md:col-span-2 md:row-span-1', 
            'md:col-span-4 md:row-span-1', 
          ];

          const Icon = icons[i % icons.length];

          return (
            <div 
              key={i} 
              className={`p-10 rounded-[48px] bg-white/[0.03] border border-white/5 hover:border-primary/40 hover:bg-white/[0.06] transition-all duration-700 group shadow-2xl relative overflow-hidden flex flex-col ${gridClasses[i] || 'md:col-span-2'}`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-700" />
              
              <div className="flex-1">
                 <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl border border-primary/20">
                   <Icon size={28} strokeWidth={2.5} />
                 </div>
                 
                 <h4 className="text-3xl font-black text-white mb-4 tracking-tight uppercase italic group-hover:text-primary transition-colors duration-500">
                   {item.title}
                 </h4>
                 
                 <p className="text-slate-400 text-lg leading-relaxed font-medium line-clamp-3">
                   {item.description}
                 </p>
              </div>

              <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <ArrowRight className="text-primary w-8 h-8" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesBento;