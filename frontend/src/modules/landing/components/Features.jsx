import { Zap, Palette, Shield, Rocket, Users, Globe } from 'lucide-react';

const features = [
  {
    icon: <Zap className="text-blue-600" size={28} />,
    title: 'Fácil de Usar',
    description: 'Interfaz intuitiva que no requiere conocimientos técnicos. Configura todo en minutos.'
  },
  {
    icon: <Palette className="text-blue-600" size={28} />,
    title: '100% Personalizable',
    description: 'Adapta colores, fuentes y layout a tu marca. Tu negocio, tu estilo.'
  },
  {
    icon: <Shield className="text-blue-600" size={28} />,
    title: 'Seguridad Garantizada',
    description: 'Tus datos protegidos con encriptación de nivel bancario y backups diarios.'
  },
  {
    icon: <Rocket className="text-blue-600" size={28} />,
    title: 'Escalable',
    description: 'Agrega módulos según crece tu negocio. Paga solo por lo que necesitas.'
  },
  {
    icon: <Users className="text-blue-600" size={28} />,
    title: 'Multi-usuario',
    description: 'Invita a tu equipo con roles y permisos personalizados por empleado.'
  },
  {
    icon: <Globe className="text-blue-600" size={28} />,
    title: 'Dominio Propio',
    description: 'Usa tu propio dominio o un subdominio gratuito. Tú decides.'
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ModularBusiness te ofrece todas las herramientas para gestionar tu negocio
            de forma eficiente y profesional.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};