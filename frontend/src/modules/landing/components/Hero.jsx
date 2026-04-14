import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Headphones, MapPin, Rocket, Gift } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Hero = () => {
  const [count, setCount] = useState({ modules: 0, uptime: 0, savings: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => ({
        modules: prev.modules < 8 ? prev.modules + 1 : 8,
        uptime: prev.uptime < 99 ? prev.uptime + 3 : 99,
        savings: prev.savings < 30 ? prev.savings + 2 : 30,
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Fondo con gradiente animado */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-secondary/20 animate-pulse-slow" />
      <div className="absolute inset-0 bg-noise" />
      
      {/* Partículas flotantes (efecto decorativo) */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float animation-delay-1000" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="animate-fade-in-up">
            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="glass-light px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-fade-in-down">
                <MapPin size={16} className="text-primary" />
                🇬🇹 Hecho en Guatemala
              </span>
              <span className="glass-light px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-fade-in-down animation-delay-100">
                <Headphones size={16} className="text-secondary" />
                Soporte 24/7
              </span>
              <span className="glass-light px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-fade-in-down animation-delay-200">
                <Shield size={16} className="text-accent" />
                Pago sin comisión extra
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Tu Negocio, </span>
              <span className="text-gradient">Tus Reglas, </span>
              <br />
              <span className="text-gradient">Tus Módulos</span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 animate-fade-in-up animation-delay-100">
              Crea tu sistema de gestión personalizado. Elige los módulos que necesitas 
              y paga solo por lo que usas. Sin complicaciones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-200">
              <Link
                to="/register"
                className="group bg-linear-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:glow-effect transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                Comienza tu Prueba de 3 Días
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="glass px-8 py-4 rounded-xl text-lg font-semibold text-white hover:bg-white/10 transition"
              >
                Ver Características
              </button>
            </div>
            
            <p className="mt-4 text-sm text-slate-400 animate-fade-in-up animation-delay-300">
              *Requiere tarjeta de crédito. También aceptamos transferencia o efectivo.
            </p>
          </div>
          
          {/* Right Column - Early Adopter Card */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="glass rounded-2xl p-8 glow-effect relative overflow-hidden">
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full blur-2xl" />
              
              {/* Badge de Early Adopter */}
              <div className="absolute -top-3 -right-3">
                <span className="flex items-center gap-2 bg-linear-to-r from-yellow-500 to-amber-500 text-dark-950 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  <Rocket size={16} />
                  EARLY ADOPTER
                </span>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-linear-to-br from-primary/30 to-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  ¡Crece con nosotros!
                </h3>
                <p className="text-slate-300">
                  Sé uno de nuestros primeros clientes y accede a precios especiales de lanzamiento.
                </p>
              </div>
              
              {/* Beneficios */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 glass-light rounded-xl">
                  <Gift className="text-green-400 shrink-0" size={20} />
                  <span className="text-slate-200 text-sm">
                    <strong className="text-white">Precios accesible</strong> en tu primer año
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 glass-light rounded-xl">
                  <Sparkles className="text-yellow-400 shrink-0" size={20} />
                  <span className="text-slate-200 text-sm">
                    <strong className="text-white">Soporte prioritario</strong> y configuración personalizada
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 glass-light rounded-xl">
                  <Rocket className="text-primary shrink-0" size={20} />
                  <span className="text-slate-200 text-sm">
                    <strong className="text-white">Influencia en el roadmap</strong> del producto
                  </span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-primary/20">
                <div>
                  <p className="text-2xl font-bold text-gradient">{count.modules}</p>
                  <p className="text-slate-400 text-xs">Módulos</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gradient">{count.uptime}%</p>
                  <p className="text-slate-400 text-xs">Uptime</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gradient">{count.savings}%</p>
                  <p className="text-slate-400 text-xs">Ahorro</p>
                </div>
              </div>
              
              {/* CTA */}
              <Link
                to="/register"
                className="mt-6 w-full bg-linear-to-r from-yellow-500 to-amber-500 text-dark-950 font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                ¡Quiero ser Early Adopter!
                <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};