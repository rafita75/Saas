import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlowCard } from '../../../shared/components/GlowCard';
import { SectionTitle } from '../../../shared/components/SectionTitle';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    icon: <Zap size={24} />,
    description: 'Perfecto para empezar',
    monthlyPrice: '99',
    yearlyPrice: '79',
    features: [
      '1 Módulo a elegir',
      'Hasta 5 empleados',
      'Soporte por email',
      'Subdominio gratis',
      'Almacenamiento 5GB',
      'Actualizaciones incluidas'
    ],
    highlighted: false,
    cta: 'Comenzar Prueba',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30'
  },
  {
    name: 'Pro',
    icon: <Sparkles size={24} />,
    description: 'Para negocios en crecimiento',
    monthlyPrice: '299',
    yearlyPrice: '239',
    features: [
      '3 Módulos a elegir',
      'Hasta 20 empleados',
      'Soporte prioritario 24/7',
      'Dominio personalizado',
      'Reportes avanzados',
      'Almacenamiento 20GB',
      'API acceso',
      'Facturación FEL incluida'
    ],
    highlighted: true,
    cta: 'Probar Pro',
    color: 'from-primary/30 to-secondary/30',
    borderColor: 'border-primary',
    badge: 'Más Popular'
  },
  {
    name: 'Business',
    icon: <Crown size={24} />,
    description: 'Para empresas establecidas',
    monthlyPrice: '499',
    yearlyPrice: '399',
    features: [
      '5 Módulos a elegir',
      'Empleados ilimitados',
      'Soporte dedicado 24/7',
      'Personalización total',
      'Almacenamiento 100GB',
      'Múltiples sucursales',
      'Inventario inteligente',
      'POS moderno incluido'
    ],
    highlighted: false,
    cta: 'Contactar',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30'
  }
];

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle 
          subtitle="Elige el plan perfecto para tu negocio. Todos incluyen prueba de 3 días."
        >
          Planes que crecen contigo
        </SectionTitle>
        
        {/* Toggle Mensual/Anual */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-sm ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
            Mensual
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-7 bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-300"
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${isYearly ? 'right-1' : 'left-1'}`} />
          </button>
          <span className={`text-sm ${isYearly ? 'text-white' : 'text-slate-400'}`}>
            Anual
            <span className="ml-2 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
              -20%
            </span>
          </span>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <GlowCard 
              key={index} 
              className={`relative ${plan.highlighted ? 'scale-105 border-2' : ''} ${plan.borderColor} animate-fade-in-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-primary to-secondary text-white text-xs px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${plan.color} flex items-center justify-center mb-4`}>
                <span className="text-white">{plan.icon}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-1">
                {plan.name}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {plan.description}
              </p>
              
              <div className="mb-6">
                <p className="text-4xl font-bold text-gradient">
                  Q{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </p>
                <p className="text-slate-400 text-sm">
                  /mes {isYearly && 'facturado anualmente'}
                </p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={18} className="text-green-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                to={plan.name === 'Business' ? '/contact' : '/register'}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-linear-to-r from-primary to-secondary text-white hover:glow-effect'
                    : 'glass text-white hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>
            </GlowCard>
          ))}
        </div>
        
        <p className="text-center text-sm text-slate-400 mt-8">
          ¿Necesitas algo más personalizado?{' '}
          <a 
            href="https://wa.me/50237674506" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-secondary transition"
          >
            Escríbenos por WhatsApp →
          </a>
        </p>
      </div>
    </section>
  );
};