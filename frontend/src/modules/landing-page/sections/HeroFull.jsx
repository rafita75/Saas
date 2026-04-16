import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * HeroFull: Diseño impactante con imagen de fondo completa.
 * Utiliza efectos de glassmorphism y capas de profundidad con gradientes.
 */
const HeroFull = ({ content, handleAction, isPreview = false }) => {
  const { 
    title = 'Explora lo Extraordinario', 
    description = 'Una experiencia inmersiva diseñada para elevar los sentidos y redefinir los límites de lo posible.',
    ctaText = 'Descubrir Ahora',
    image = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
    action = {}
  } = content;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Capa de Imagen con Efecto Parallax-like */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={image} 
          className="w-full h-full object-cover scale-110 animate-pulse-slow" 
          alt="Background" 
        />
        {/* Capas de Overlay para Legibilidad y Estilo */}
        <div className="absolute inset-0 bg-dark-950/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950/40 via-transparent to-dark-950" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent" />
      </div>
      
      {/* Contenido Central */}
      <div className="max-w-6xl mx-auto text-center relative z-10 space-y-12 animate-in fade-in zoom-in duration-1000">
        <h1 className="text-6xl md:text-[10rem] font-black leading-none text-white tracking-tighter drop-shadow-2xl italic uppercase select-none opacity-90">
          {title}
        </h1>
        
        <p className="text-slate-200 text-xl md:text-4xl mb-16 max-w-4xl mx-auto font-medium drop-shadow-lg leading-relaxed tracking-tight">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button 
            onClick={() => handleAction(action)}
            className="px-20 py-8 bg-white text-black rounded-[24px] font-black text-2xl hover:scale-110 hover:shadow-[0_0_100px_-20px_rgba(255,255,255,0.5)] transition-all duration-500 shadow-2xl flex items-center gap-4 uppercase italic"
          >
            {ctaText} <ArrowRight size={32} strokeWidth={3} />
          </button>
          
          <div className="hidden sm:block h-1 w-20 bg-white/20 rounded-full" />
          
          <button className="text-white font-black text-lg uppercase tracking-[0.3em] hover:text-primary transition-colors">
            Saber Más
          </button>
        </div>
      </div>

      {/* Decoración Inferior */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 animate-bounce">
         <div className="w-px h-20 bg-gradient-to-b from-white to-transparent" />
      </div>
    </div>
  );
};

export default HeroFull;