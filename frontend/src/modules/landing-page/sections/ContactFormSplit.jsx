import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

/**
 * ContactFormSplit: Sección de contacto con info a un lado y formulario al otro.
 * Basado en los diseños de ModularBusiness y Elite.
 */
const ContactFormSplit = ({ content, theme = {} }) => {
  const { 
    title = '¿Listo para empezar?', 
    description = 'Nuestro equipo está listo para ayudarte a escalar tu negocio.',
    email = 'hola@tuempresa.com',
    phone = '+1 234 567 890',
    address = 'Calle Innovación 123, Tech City',
  } = content;

  const isDark = theme.darkMode;
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const descColor = isDark ? 'text-slate-400' : 'text-slate-600';
  const inputBg = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

  return (
    <div className={`py-24 px-8 ${theme.font ? `font-${theme.font.toLowerCase().replace(' ', '-')}` : ''}`}>
      <div className={`max-w-7xl mx-auto rounded-[3rem] overflow-hidden border ${isDark ? 'bg-primary/10 border-white/10' : 'bg-primary border-primary/20 shadow-2xl shadow-primary/30'} flex flex-col lg:flex-row`}>
        
        {/* Info Side */}
        <div className="lg:w-1/2 p-12 lg:p-20 space-y-12 text-white">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h2>
            <p className="text-primary-100 text-lg opacity-80">{description}</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm opacity-60 uppercase font-bold tracking-widest">Email</p>
                <p className="text-xl font-medium">{email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <Phone size={24} />
              </div>
              <div>
                <p className="text-sm opacity-60 uppercase font-bold tracking-widest">Teléfono</p>
                <p className="text-xl font-medium">{phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm opacity-60 uppercase font-bold tracking-widest">Ubicación</p>
                <p className="text-xl font-medium">{address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className={`lg:w-1/2 p-12 lg:p-20 ${isDark ? 'bg-black/20' : 'bg-white'}`}>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nombre</label>
                <input type="text" className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all ${inputBg} ${isDark ? 'text-white' : 'text-slate-900'}`} placeholder="Tu nombre" />
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email</label>
                <input type="email" className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all ${inputBg} ${isDark ? 'text-white' : 'text-slate-900'}`} placeholder="tu@email.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mensaje</label>
              <textarea rows={4} className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-primary outline-none transition-all ${inputBg} ${isDark ? 'text-white' : 'text-slate-900'}`} placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>

            <button className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isDark ? 'bg-primary text-white hover:bg-primary/90' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl'}`}>
              Enviar Solicitud <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactFormSplit;