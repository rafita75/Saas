import React from 'react';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';

/**
 * ContactPremium: Diseño sofisticado con efecto glassmorphism y jerarquía clara.
 * Incluye interactividad mejorada para los canales de comunicación.
 */
const ContactPremium = ({ content, handleAction, isPreview = false }) => {
  const { 
    title = '¿Listo para el Siguiente Nivel?', 
    description = 'Hablemos sobre tus objetivos y cómo podemos alcanzarlos juntos con una estrategia a medida.',
    email = 'hola@tuempresa.com',
    phone = '+502 0000 0000',
    action = {}
  } = content;

  return (
    <div className="max-w-5xl mx-auto py-32 lg:py-56 px-8 relative">
      {/* Luces de fondo decorativas */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -ml-48 -mb-48" />
      
      <div className="glass rounded-[70px] p-16 lg:p-32 border border-white/10 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-dark-900/40 backdrop-blur-2xl">
        <div className="relative z-10 space-y-12 animate-in fade-in zoom-in duration-1000">
          <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">
            {title}
          </h2>
          
          <p className="text-slate-400 text-xl md:text-2xl mb-20 max-w-2xl mx-auto leading-relaxed font-medium">
            {description}
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
            {email && (
              <button 
                onClick={() => handleAction({ type: 'email', value: email })} 
                className="flex flex-col items-center gap-6 group hover:scale-110 transition-all duration-500"
              >
                <div className="w-24 h-24 rounded-[32px] bg-dark-800 border border-white/10 flex items-center justify-center group-hover:text-primary group-hover:border-primary/50 transition-all shadow-2xl group-hover:shadow-primary/20 ring-4 ring-transparent group-hover:ring-primary/5">
                  <Mail size={40} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Canal Digital</p>
                  <p className="text-2xl font-black text-white group-hover:text-primary transition-colors underline decoration-primary/30 underline-offset-8">{email}</p>
                </div>
              </button>
            )}
            
            {phone && (
              <button 
                onClick={() => handleAction({ type: 'phone', value: phone })} 
                className="flex flex-col items-center gap-6 group hover:scale-110 transition-all duration-500"
              >
                <div className="w-24 h-24 rounded-[32px] bg-dark-800 border border-white/10 flex items-center justify-center group-hover:text-primary group-hover:border-primary/50 transition-all shadow-2xl group-hover:shadow-primary/20 ring-4 ring-transparent group-hover:ring-primary/5">
                  <MessageCircle size={40} strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Atención Directa</p>
                  <p className="text-2xl font-black text-white group-hover:text-primary transition-colors underline decoration-primary/30 underline-offset-8">{phone}</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Adorno visual interno */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 pointer-events-none" />
      </div>
    </div>
  );
};

export default ContactPremium;