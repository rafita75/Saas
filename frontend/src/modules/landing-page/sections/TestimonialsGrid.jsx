import React from 'react';

/**
 * TestimonialsGrid: Diseño de testimonios con tarjetas flotantes y sombras profundas.
 * Aporta credibilidad y un toque humano de alto nivel al sitio.
 */
const TestimonialsGrid = ({ content, isPreview = false }) => {
  const { 
    title = 'Confían en Nosotros', 
    items = [] 
  } = content;

  return (
    <div className="max-w-7xl mx-auto py-32 lg:py-56 px-8 text-center bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
      {/* Luz de fondo ambiental */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="relative z-10 space-y-32">
        <div className="space-y-6">
           <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
             Testimonios
           </h2>
           <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
           <p className="text-slate-500 text-xl font-bold uppercase tracking-[0.3em]">{title}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <div 
              key={i} 
              className="p-14 rounded-[64px] bg-dark-900 border border-white/10 italic text-slate-300 relative shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] hover:translate-y-[-15px] transition-all duration-700 group"
            >
              {/* Comilla decorativa */}
              <div className="absolute -top-8 left-16 w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white font-serif text-5xl shadow-2xl shadow-primary/40 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                “
              </div>
              
              <p className="mb-12 text-xl leading-relaxed font-semibold">
                "{item.description}"
              </p>
              
              <div className="flex items-center justify-center gap-6 not-italic">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg ring-4 ring-white/5" />
                <div className="text-left">
                   <p className="font-black text-white text-base uppercase tracking-widest leading-none mb-1">{item.title}</p>
                   <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Cliente Verificado</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsGrid;