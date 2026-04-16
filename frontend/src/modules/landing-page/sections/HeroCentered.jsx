import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * HeroCentered: Diseño minimalista y elegante.
 * Enfoque en la tipografía masiva y el equilibrio de espacios.
 */
const HeroCentered = ({ content, handleAction, isPreview = false }) => {
  const { 
    title = 'Creatividad Pura', 
    description = 'Diseñamos marcas que cuentan historias inolvidables y perduran en el tiempo.',
    ctaText = 'Ver Portafolio',
    badge = 'Mínimo · Elegante · Único',
    action = {}
  } = content;

  return (
    <div className="max-w-6xl mx-auto text-center py-32 lg:py-56 px-6 relative overflow-hidden">
      {/* Elementos Decorativos de Fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] backdrop-blur-md">
          {badge}
        </div>
        
        <h1 className="text-7xl md:text-[9rem] font-black mb-10 leading-[1.05] tracking-tighter text-white uppercase italic">
          {title}
        </h1>
        
        <p className="text-slate-400 text-2xl md:text-3xl mb-16 max-w-3xl mx-auto leading-relaxed font-light tracking-tight">
          {description}
        </p>
        
        <div className="flex flex-col items-center gap-10">
          {ctaText && (
            <button 
              onClick={() => handleAction(action)}
              className="px-16 py-6 bg-primary text-white rounded-full font-black text-xl hover:glow-effect transition-all shadow-2xl shadow-primary/20 uppercase italic tracking-widest active:scale-95"
            >
              {ctaText}
            </button>
          )}
          
          <div className="flex items-center gap-4 text-slate-600 opacity-40">
             <div className="w-12 h-px bg-slate-700" />
             <Sparkles size={20} />
             <div className="w-12 h-px bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCentered;