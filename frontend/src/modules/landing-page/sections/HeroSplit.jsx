import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * HeroSplit: Diseño flexible con texto e imagen.
 * Se adapta a estilos corporativos (Modular), minimalistas (Lumina) o de lujo (Elite).
 */
const HeroSplit = ({ content, handleAction, theme = {}, isPreview = false }) => {
  const { 
    title = 'Impulsa tu Visión Digital', 
    description = 'Creamos experiencias extraordinarias que conectan marcas con personas en todo el mundo.',
    ctaText = 'Comenzar Proyecto',
    secondaryCtaText = '',
    image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    badge = '',
    action = {},
    secondaryAction = {}
  } = content;

  // Estilos dinámicos basados en el tema
  const isDark = theme.darkMode;
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const descColor = isDark ? 'text-slate-400' : 'text-slate-600';
  
  return (
    <div className={`max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-20 lg:py-32 px-8 ${theme.font ? `font-${theme.font.toLowerCase().replace(' ', '-')}` : ''}`}>
      <div className="space-y-8 text-left animate-in fade-in slide-in-from-left duration-1000">
        {badge && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            {badge}
          </div>
        )}
        
        <h1 className={`text-5xl md:text-7xl font-bold leading-tight tracking-tight ${textColor}`}>
          {title}
        </h1>
        
        <p className={`text-lg md:text-xl leading-relaxed max-w-lg font-medium ${descColor}`}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-4 items-center pt-4">
          <button 
            onClick={() => handleAction(action)}
            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center gap-3 shadow-xl shadow-primary/20"
          >
            {ctaText} <ArrowRight size={20} />
          </button>
          
          {secondaryCtaText && (
            <button 
              onClick={() => handleAction(secondaryAction)}
              className={`px-8 py-4 rounded-2xl font-bold text-lg border transition-all ${isDark ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'}`}
            >
              {secondaryCtaText}
            </button>
          )}
        </div>
      </div>

      <div className="relative group animate-in fade-in zoom-in duration-1000 delay-200">
        <div className={`absolute -inset-4 bg-primary/20 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700`} />
        
        <div className="relative aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
          <img 
            src={image} 
            alt="Hero Visual" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default HeroSplit;