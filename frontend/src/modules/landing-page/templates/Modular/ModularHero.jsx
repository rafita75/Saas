import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * ModularHero: Réplica 1:1 del diseño SaaS de Stitch (screen.png).
 * Diseño con badge flotante, título tipográfico masivo y mockup lateral.
 */
const ModularHero = ({ content, theme = {}, handleAction, isEditor = false }) => {
  const { 
    badge = 'POWERED BY J&M SYSTEMS',
    title = 'La estructura modular para el éxito empresarial.',
    description = 'Escala tu negocio con precisión digital. Nuestra arquitectura permite una integración fluida de procesos y datos en un solo ecosistema coherente.',
    ctaText = 'Agendar Demo',
    secondaryCtaText = 'Ver Módulos',
    image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    action = {},
    secondaryAction = {}
  } = content;

  return (
    <div className="relative bg-white pt-24 lg:pt-32 pb-20 px-8 lg:px-20 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Text Content */}
        <div className="lg:w-3/5 space-y-10 text-left">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">{badge}</span>
          </div>

          <h1 className="text-6xl lg:text-[5.5rem] font-bold text-slate-950 leading-[0.95] tracking-tight">
            {title.split(' ').map((word, i) => (
              <span key={i} className={word.toLowerCase() === 'modular' ? 'text-indigo-600' : ''}>{word} </span>
            ))}
          </h1>

          <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={() => handleAction(action)}
              className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
              {ctaText}
            </button>
            <button 
              onClick={() => handleAction(secondaryAction)}
              className="px-10 py-5 bg-slate-100 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
            >
              {secondaryCtaText}
            </button>
          </div>
        </div>

        {/* Visual Mockup */}
        <div className="lg:w-2/5 relative group">
          <div className="absolute -inset-4 bg-indigo-600/5 rounded-[3rem] blur-3xl opacity-50" />
          <div className="relative aspect-[4/3] lg:aspect-square bg-white rounded-[3rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
            <img src={image} alt="Dashboard Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-transparent" />
          </div>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto mt-24 lg:mt-32 pt-12 border-t border-slate-100 flex flex-wrap justify-between items-center gap-12 opacity-40 grayscale pointer-events-none">
        {['SEGURIDAD TOTAL', 'VELOCIDAD EXTREMA', 'ESCALABILIDAD', 'SINCRONIZACIÓN'].map((text) => (
          <span key={text} className="text-xs font-black uppercase tracking-[0.4em] text-slate-900">{text}</span>
        ))}
      </div>
    </div>
  );
};

export default ModularHero;