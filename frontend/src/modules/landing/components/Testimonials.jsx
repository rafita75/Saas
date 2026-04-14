import { GlowCard } from '../../../shared/components/GlowCard';
import { SectionTitle } from '../../../shared/components/SectionTitle';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'María González',
    role: 'Dueña de Tienda de Ropa',
    company: 'Moda & Estilo GT',
    content: 'ModularBusiness transformó completamente mi negocio. Ahora gestiono inventario, ventas en línea y en tienda física desde un solo lugar. ¡Increíble!',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=6366F1&color=fff&size=64'
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Gerente de Operaciones',
    company: 'TechSolutions',
    content: 'La facilidad de usar módulos independientes nos permitió empezar con lo básico y escalar según crecíamos. El soporte 24/7 es excepcional.',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=8B5CF6&color=fff&size=64'
  },
  {
    name: 'Ana Lucía Méndez',
    role: 'Propietaria',
    company: 'Spa & Bienestar',
    content: 'El módulo de reservas cambió mi vida. Mis clientes agendan sus citas solos y yo recibo notificaciones automáticas. Ahorro horas de trabajo al día.',
    rating: 5,
    image: 'https://ui-avatars.com/api/?name=Ana+Lucia+Mendez&background=06B6D4&color=fff&size=64'
  }
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 px-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-linear-to-t from-dark-950 via-dark-900 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle 
          subtitle="Cientos de negocios guatemaltecos ya confían en nosotros para gestionar sus operaciones diarias."
        >
          Lo que dicen nuestros clientes
        </SectionTitle>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <GlowCard 
              key={index} 
              className="relative animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full border-2 border-primary/50"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                  <p className="text-xs text-primary">{testimonial.company}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <p className="text-slate-300 italic">
                "{testimonial.content}"
              </p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
};