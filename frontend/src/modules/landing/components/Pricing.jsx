import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Básico',
    description: 'Perfecto para empezar',
    price: '199',
    features: [
      '1 Módulo a elegir',
      'Hasta 5 empleados',
      'Soporte por email',
      'Subdominio gratis',
      'Almacenamiento 5GB'
    ],
    highlighted: false,
    cta: 'Comenzar Gratis'
  },
  {
    name: 'Pro',
    description: 'Para negocios en crecimiento',
    price: '499',
    features: [
      '3 Módulos a elegir',
      'Hasta 20 empleados',
      'Soporte prioritario 24/7',
      'Dominio personalizado',
      'Reportes avanzados',
      'Almacenamiento 20GB',
      'API acceso'
    ],
    highlighted: true,
    cta: 'Probar Pro'
  },
  {
    name: 'Business',
    description: 'Para empresas establecidas',
    price: '799',
    features: [
      '5 Módulos a elegir',
      'Empleados ilimitados',
      'Soporte dedicado',
      'Personalización total',
      'Almacenamiento 100GB',
      'Facturación electrónica',
      'Múltiples sucursales'
    ],
    highlighted: false,
    cta: 'Contactar Ventas'
  }
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Planes que crecen contigo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige el plan perfecto para tu negocio. Todos incluyen prueba gratis de 14 días.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-blue-600 text-white shadow-xl scale-105 border-2 border-blue-700'
                  : 'bg-white border border-gray-200 shadow-sm'
              }`}
            >
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <p className={`mb-4 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <p className="mb-6">
                <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  Q{plan.price}
                </span>
                <span className={plan.highlighted ? 'text-blue-100' : 'text-gray-600'}>
                  /mes
                </span>
              </p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check size={20} className={plan.highlighted ? 'text-blue-200' : 'text-green-500'} />
                    <span className={plan.highlighted ? 'text-blue-50' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Link
                to={plan.name === 'Business' ? '/contact' : '/register'}
                className={`block w-full text-center py-3 rounded-lg font-semibold transition ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
        
        <p className="text-center text-sm text-gray-500 mt-8">
          ¿Necesitas algo más personalizado? <Link to="/contact" className="text-blue-600 hover:underline">Contáctanos</Link>
        </p>
      </div>
    </section>
  );
};