import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * HeroSplit: Diseño moderno con texto a la izquierda e imagen a la derecha.
 * Incluye efectos de gradiente, sombras suaves y jerarquía tipográfica premium.
 */
const HeroSplit = ({ content, handleAction, isPreview = false }) => {
  const { 
    title = 'Impulsa tu Visión Digital', 
    description = 'Creamos experiencias extraordinarias que conectan marcas con personas en todo el mundo.',
    ctaText = 'Comenzar Proyecto',
    image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    badge = 'Diseño de Vanguardia',
    action = {}
  } = content;

  return (
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center py-24 lg:py-48 px-8">
      <div className="space-y-12 text-left animate-in fade-in slide-in-from-left duration-1000">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-[0.2em]">
          <Sparkles size={14} /> {badge}
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black leading-[0.9] text-white tracking-tighter uppercase italic">
          {title}
        </h1>
        
        <p className="text-slate-400 text-xl md:text-2xl leading-relaxed max-w-lg font-medium">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-6 items-center">
          <button 
            onClick={() => handleAction(action)}
            className="group px-12 py-6 bg-primary text-white rounded-[24px] font-black text-xl hover:glow-effect transition-all flex items-center gap-4 shadow-2xl shadow-primary/20 uppercase italic"
          >
            {ctaText} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      <div className="relative group animate-in fade-in zoom-in duration-1000 delay-200">
        {/* Elementos Decorativos */}
        <div className="absolute -inset-4 bg-primary/30 rounded-[70px] blur-3xl opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-[80px]" />
        
        <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/20 group-hover:rotate-1 transition-transform duration-700">
          <img 
            src={image} 
            alt="Hero Visual" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" 
          />
          {/* Overlay suave para profundidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default HeroSplit;