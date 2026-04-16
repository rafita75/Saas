/**
 * Configuración de Plantillas predefinidas para el Módulo de Landing Page
 * Categorías: Negocio, Producto, Marca Personal, Gastronomía, Tech, Moda.
 */
export const LANDING_TEMPLATES = [
  {
    id: 'basic-business',
    name: 'Negocio Moderno',
    level: 'gratis',
    description: 'Diseño corporativo con imagen al lado.',
    theme: { primaryColor: '#6366f1', secondaryColor: '#f43f5e', font: 'Inter', darkMode: true },
    sections: [
      { id: 'hero-1', type: 'hero', content: { layout: 'split', title: 'Impulsa tu negocio hoy', description: 'Soluciones innovadoras para empresas que buscan crecer.', ctaText: 'Comenzar Ahora', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80' }, order: 0 },
      { id: 'feat-1', type: 'features', content: { title: 'Nuestros Pilares', items: [{ title: 'Velocidad', description: 'Rendimiento optimizado.' }, { title: 'Seguridad', description: 'Datos protegidos.' }, { title: 'Soporte', description: 'Atención 24/7.' }] }, order: 1 },
      { id: 'cont-1', type: 'contact', content: { title: 'Contáctanos', description: '¿Listo para empezar?', email: 'info@empresa.com' }, order: 2 }
    ]
  },
  {
    id: 'gourmet-delight',
    name: 'Gourmet Delight',
    level: 'gratis',
    description: 'Impactante con imagen de fondo completa.',
    theme: { primaryColor: '#f59e0b', secondaryColor: '#78350f', font: 'Playfair Display', darkMode: true },
    sections: [
      { id: 'hero-2', type: 'hero', content: { layout: 'background', title: 'Sabor de Autor', description: 'Experiencia culinaria única con ingredientes locales.', ctaText: 'Ver Menú', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80' }, order: 0 },
      { id: 'cta-1', type: 'cta', content: { title: 'Reserva tu Mesa', description: 'Cupos limitados para cenas especiales.', buttonText: 'Reservar Ahora' }, order: 1 },
      { id: 'cont-2', type: 'contact', content: { title: 'Ubicación', description: 'Te esperamos en el corazón de la ciudad.', phone: '+502 1234-5678' }, order: 2 }
    ]
  },
  {
    id: 'minimal-brand',
    name: 'Minimal Portfolio',
    level: 'gratis',
    description: 'Estilo centrado, limpio y minimalista.',
    theme: { primaryColor: '#10b981', secondaryColor: '#064e3b', font: 'Montserrat', darkMode: false },
    sections: [
      { id: 'hero-3', type: 'hero', content: { layout: 'centered', title: 'Creatividad Pura', description: 'Diseñamos marcas que cuentan historias inolvidables.', ctaText: 'Ver Portafolio', image: '' }, order: 0 },
      { id: 'feat-2', type: 'features', content: { title: 'Nuestra Esencia', items: [{ title: 'Mínimo', description: 'Menos es más.' }, { title: 'Elegante', description: 'Diseño atemporal.' }, { title: 'Único', description: 'Piezas exclusivas.' }] }, order: 1 },
      { id: 'cont-3', type: 'contact', content: { title: 'Hablemos', description: 'Estamos listos para tu próximo gran reto.', email: 'hello@minimal.com' }, order: 2 }
    ]
  }
];