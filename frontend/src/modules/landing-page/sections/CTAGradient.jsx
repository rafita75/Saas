import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * CTAGradient: Sección de cierre con alto impacto visual.
 * Diseñada para forzar la conversión mediante el uso de gradientes y tipografía masiva.
 */
const CTAGradient = ({ content, handleAction, isPreview = false }) => {
  const { 
    title = '¿Listo para el cambio?', 
    description = 'Únete a miles de empresas que ya están transformando su futuro hoy mismo.',
    buttonText = 'Empezar ahora',
    action = {}
  } = content;

  return (
    <div className="max-w-7xl mx-auto py-32 lg:py-56 px-8 relative overflow-hidden group">
      {/* Luz ambiental externa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[200px] pointer-events-none rounded-full" />
      
      <div className="p-20 lg:p-40 rounded-[100px] bg-gradient-to-br from-primary via-primary to-secondary text-center space-y-12 shadow-[0_40px_150px_-30px_rgba(99,102,241,0.7)] relative overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        
        {/* Destellos de luz internos */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] -mr-300 -mt-300 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-dark-950/20 rounded-full blur-[100px] -ml-200 -mb-200" />
        
        <div className="relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
          <h2 className="text-6xl md:text-[10rem] font-black text-white tracking-[calc(-0.05em)] leading-[0.85] uppercase italic drop-shadow-2xl">
            {title}
          </h2>
          
          <p className="text-indigo-50/90 text-2xl md:text-4xl max-w-4xl mx-auto font-bold tracking-tight drop-shadow-lg leading-relaxed">
            {description}
          </p>
          
          <div className="pt-10">
            <button 
              onClick={() => handleAction(action)}
              className="px-20 py-10 bg-white text-primary rounded-[40px] font-black text-4xl hover:scale-110 hover:shadow-[0_20px_100px_rgba(255,255,255,0.4)] transition-all duration-700 uppercase italic shadow-2xl active:scale-95 group/btn"
            >
              <span className="flex items-center gap-6">
                {buttonText || 'Comenzar'} 
                <ArrowRight size={48} strokeWidth={3} className="group-hover/btn:translate-x-4 transition-transform duration-500" />
              </span>
            </button>
          </div>
        </div>

        {/* Efecto de brillo al pasar el mouse sobre el contenedor */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      </div>
    </div>
  );
};

export default CTAGradient;