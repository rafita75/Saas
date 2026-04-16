import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import EditableText from '../../builder/components/EditableText';

/**
 * ModularPricing: Réplica exacta del diseño "Inversión en Crecimiento" de Stitch.
 */
const ModularPricing = ({ content, theme = {}, isPreview = false }) => {
  const { 
    title = 'Inversión en Crecimiento',
    subtitle = 'Modelos de suscripción transparentes y escalables para cada etapa empresarial.',
    items = [
      { name: 'ESENCIAL', price: '499', features: ['Hasta 5 usuarios', '3 Módulos básicos'] },
      { name: 'PROFESIONAL', price: '999', isPopular: true, features: ['Usuarios Ilimitados', 'Todos los Módulos'] },
      { name: 'ENTERPRISE', price: 'Custom', features: ['Infraestructura Dedicada', 'API Personalizada'] }
    ]
  } = content;

  return (
    <div className={`py-32 px-8 bg-slate-50/50 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-4">
          <EditableText field="title" value={title} as="h2" className="text-4xl md:text-5xl font-bold text-slate-900" isPreview={isPreview} />
          <EditableText field="subtitle" value={subtitle} as="p" className="text-slate-500 text-lg max-w-2xl mx-auto" isPreview={isPreview} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-10 rounded-[2rem] border transition-all duration-500 flex flex-col ${
                plan.isPopular 
                ? 'bg-white border-primary shadow-2xl shadow-primary/10 scale-105 z-10' 
                : 'bg-white/50 border-slate-200 hover:border-slate-300'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">
                  Más Popular
                </div>
              )}

              <div className="space-y-6 flex-grow">
                <div className="space-y-2">
                  <EditableText itemIdx={idx} itemField="name" value={plan.name} as="h3" className="text-sm font-bold text-slate-400 uppercase tracking-widest" isPreview={isPreview} />
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-slate-900">$</span>
                    <EditableText itemIdx={idx} itemField="price" value={plan.price} as="span" className="text-5xl font-bold text-slate-900" isPreview={isPreview} />
                    <span className="text-slate-400 font-medium">/mes</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-indigo-50 text-indigo-600">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-slate-600 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10">
                <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  plan.isPopular 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                  : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                }`}>
                  {plan.isPopular ? 'Comenzar Ahora' : 'Seleccionar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModularPricing;