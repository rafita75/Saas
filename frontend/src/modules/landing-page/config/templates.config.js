/**
 * Configuración de Plantillas predefinidas para el Módulo de Landing Page
 * Categorías: Negocio, Producto, Marca Personal, Gastronomía, Tech, Moda.
 */
export const LANDING_TEMPLATES = [
  {
    id: 'basic-business',
    name: 'Negocio Moderno',
    level: 'gratis',
    description: 'Diseño limpio y corporativo para empresas de servicios.',
    theme: { primaryColor: '#6366f1', secondaryColor: '#f43f5e', font: 'Inter', darkMode: true },
    sections: [
      { id: 'hero-1', type: 'hero', content: { title: 'Impulsa tu negocio con tecnología', description: 'Soluciones innovadoras para empresas que buscan crecer.', ctaText: 'Comenzar Ahora', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80' }, order: 0 },
      { id: 'feat-1', type: 'features', content: { title: 'Nuestros Pilares', items: [{ title: 'Velocidad', description: 'Rendimiento optimizado.' }, { title: 'Seguridad', description: 'Datos protegidos.' }, { title: 'Soporte', description: 'Atención 24/7.' }] }, order: 1 },
      { id: 'cont-1', type: 'contact', content: { title: 'Contáctanos', description: '¿Listo para empezar?', email: 'info@empresa.com' }, order: 2 }
    ]
  },
  {
    id: 'gourmet-delight',
    name: 'Gourmet Delight',
    level: 'gratis',
    description: 'Elegante y visual, perfecto para restaurantes y cafeterías.',
    theme: { primaryColor: '#f59e0b', secondaryColor: '#78350f', font: 'Playfair Display', darkMode: true },
    sections: [
      { id: 'hero-2', type: 'hero', content: { title: 'Sabor que Enamora', description: 'Descubre una experiencia culinaria única con ingredientes locales.', ctaText: 'Ver Menú', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80' }, order: 0 },
      { id: 'feat-2', type: 'features', content: { title: 'Nuestra Propuesta', items: [{ title: 'Alta Cocina', description: 'Platos de autor.' }, { title: 'Ambiente', description: 'Espacio acogedor.' }, { title: 'Eventos', description: 'Celebra con nosotros.' }] }, order: 1 },
      { id: 'cont-2', type: 'contact', content: { title: 'Haz una Reserva', description: 'Te esperamos para una cena inolvidable.', phone: '+502 1234-5678' }, order: 2 }
    ]
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    level: 'gratis',
    description: 'Estética minimalista y futurista para servicios digitales.',
    theme: { primaryColor: '#10b981', secondaryColor: '#064e3b', font: 'JetBrains Mono', darkMode: true },
    sections: [
      { id: 'hero-3', type: 'hero', content: { title: 'El Futuro es Hoy', description: 'Construimos las herramientas del mañana para los líderes de ahora.', ctaText: 'Pruébalo Gratis', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80' }, order: 0 },
      { id: 'cta-1', type: 'cta', content: { title: 'Únete a la Revolución Digital', description: 'Más de 10,000 empresas ya confían en nosotros.', buttonText: 'Crear Cuenta' }, order: 1 },
      { id: 'cont-3', type: 'contact', content: { title: 'Soporte Técnico', description: 'Estamos para resolver tus dudas.', email: 'dev@startup.com' }, order: 2 }
    ]
  },
  {
    id: 'fashion-hub',
    name: 'Fashion Hub',
    level: 'gratis',
    description: 'Enfoque visual de alto impacto para marcas de moda o estética.',
    theme: { primaryColor: '#ec4899', secondaryColor: '#831843', font: 'Montserrat', darkMode: false },
    sections: [
      { id: 'hero-4', type: 'hero', content: { title: 'Estilo sin Límites', description: 'Nueva colección de temporada disponible ahora.', ctaText: 'Comprar Colección', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80' }, order: 0 },
      { id: 'feat-3', type: 'features', content: { title: 'Por qué nosotros', items: [{ title: 'Diseño Exclusivo', description: 'Piezas únicas.' }, { title: 'Calidad Premium', description: 'Materiales de lujo.' }, { title: 'Envío Gratis', description: 'A todo el país.' }] }, order: 1 },
      { id: 'cont-4', type: 'contact', content: { title: 'Atención al Cliente', description: 'Resolvemos tus dudas sobre tallas o pedidos.', phone: '+502 9999-9999' }, order: 2 }
    ]
  },
  {
    id: 'service-pro',
    name: 'Service Pro',
    level: 'gratis',
    description: 'Optimizado para conversiones en servicios locales y profesionales.',
    theme: { primaryColor: '#3b82f6', secondaryColor: '#1e3a8a', font: 'Roboto', darkMode: false },
    sections: [
      { id: 'hero-5', type: 'hero', content: { title: 'Expertos a tu Servicio', description: 'Solucionamos tus problemas con garantía y rapidez.', ctaText: 'Pedir Cotización', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80' }, order: 0 },
      { id: 'feat-4', type: 'features', content: { title: 'Garantía Pro', items: [{ title: 'Certificados', description: 'Personal calificado.' }, { title: 'Repuestos Originales', description: 'Durabilidad garantizada.' }, { title: 'Precio Justo', description: 'Sin costos ocultos.' }] }, order: 1 },
      { id: 'cont-5', type: 'contact', content: { title: 'Solicita tu Visita', description: 'Atención inmediata en menos de 2 horas.', phone: '+502 5555-5555', email: 'citas@servicepro.com' }, order: 2 }
    ]
  }
];