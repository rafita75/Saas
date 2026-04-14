import { GlowCard } from '../../../shared/components/GlowCard';
import { SectionTitle } from '../../../shared/components/SectionTitle';
import { Zap, Palette, Shield, Rocket, Users, Globe, Smartphone, Cloud } from 'lucide-react';

const features = [
  {
    icon: <Zap className="text-primary" size={28} />,
    title: 'Rápido y Fluido',
    description: 'Interfaz optimizada que carga al instante. Navegación suave sin demoras.'
  },
  {
    icon: <Palette className="text-secondary" size={28} />,
    title: '100% Personalizable',
    description: 'Colores, fuentes y layout adaptables a tu marca. Tu estilo, tu negocio.'
  },
  {
    icon: <Shield className="text-accent" size={28} />,
    title: 'Seguridad Bancaria',
    description: 'Encriptación de grado militar. Tus datos siempre protegidos con backups diarios.'
  },
  {
    icon: <Rocket className="text-primary" size={28} />,
    title: 'Escala sin Límites',
    description: 'Agrega módulos cuando crezcas. Paga solo por lo que realmente necesitas.'
  },
  {
    icon: <Users className="text-secondary" size={28} />,
    title: 'Multi-usuario',
    description: 'Invita a tu equipo con roles y permisos personalizados para cada empleado.'
  },
  {
    icon: <Globe className="text-accent" size={28} />,
    title: 'Dominio Propio',
    description: 'Usa tu propio dominio o subdominio gratuito. Tú decides cómo aparecer.'
  },
  {
    icon: <Smartphone className="text-primary" size={28} />,
    title: '100% Responsive',
    description: 'Gestiona tu negocio desde cualquier dispositivo. Móvil, tablet o desktop.'
  },
  {
    icon: <Cloud className="text-secondary" size={28} />,
    title: 'Todo en la Nube',
    description: 'Accede desde donde quieras. Sin instalaciones ni servidores costosos.'
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle 
          subtitle="ModularBusiness te ofrece todas las herramientas para gestionar tu negocio de forma eficiente y profesional."
        >
          Todo lo que necesitas en un solo lugar
        </SectionTitle>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <GlowCard key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400">
                {feature.description}
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};