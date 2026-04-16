export const LANDING_TEMPLATES = [
  {
    id: 'modular',
    name: 'Modular Business',
    level: 'gratis',
    description: 'Arquitectura SaaS moderna con enfoque en conversión y claridad.',
    previewImage: '/plans/modules/img/screen.png',
    theme: { primaryColor: '#4f46e5', secondaryColor: '#4338ca', font: 'Inter', darkMode: false },
    sections: [
      { type: 'hero', content: { layout: 'split', badge: 'Powered by J&M Systems', title: 'La estructura modular para el éxito empresarial.', description: 'Escala tu negocio con precisión digital. Nuestra arquitectura permite una integración fluida.', ctaText: 'Agendar Demo', secondaryCtaText: 'Ver Módulos', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80' }, order: 0 },
      { type: 'features', content: { title: 'Optimización de Procesos', items: [{ title: 'Reducción del 40%', description: 'En tiempos operativos.' }, { title: 'Alertas Inteligentes', description: 'Predictivas.' }] }, order: 1 },
      { type: 'pricing', content: { title: 'Inversión en Crecimiento', items: [{ name: 'ESENCIAL', price: '499', features: ['Hasta 5 usuarios', '3 Módulos básicos'] }, { name: 'PROFESIONAL', price: '999', isPopular: true, features: ['Usuarios Ilimitados', 'Todos los Módulos'] }] }, order: 2 },
      { type: 'contact', content: { title: '¿Listo para modular tu futuro?', description: 'Solicita una consultoría gratuita hoy mismo.', email: 'contacto@modularbusiness.com', phone: '+34 900 123 456' }, order: 3 }
    ]
  },
  {
    id: 'lumina',
    name: 'Lumina Editorial',
    level: 'gratis',
    description: 'Estética minimalista y editorial para marcas de alto valor.',
    previewImage: '/plans/modules/img/screen1.png',
    theme: { primaryColor: '#171717', secondaryColor: '#404040', font: 'Playfair Display', darkMode: false },
    sections: [
      { type: 'hero', content: { layout: 'background', badge: 'Autumn / Winter 2024', title: 'The Architecture of Comfort.', description: 'Curated pieces for the modern home.', ctaText: 'Shop Collection', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80' }, order: 0 },
      { type: 'features', content: { title: 'Essential Silhouettes', items: [{ title: 'Orbital Vase', description: '$124.00' }, { title: 'Linear Lamp', description: '$440.00' }] }, order: 1 },
      { type: 'cta', content: { title: 'Keep your pulse on minimalism.', description: 'Receive curated insights twice a month.', buttonText: 'Subscribe', action: { type: 'link', value: '#' } }, order: 2 }
    ]
  },
  {
    id: 'elite',
    name: 'Elite Luxury',
    level: 'gratis',
    description: 'Diseño oscuro y sofisticado con acentos dorados para servicios premium.',
    previewImage: '/plans/modules/img/screen2.png',
    theme: { primaryColor: '#fbbf24', secondaryColor: '#d97706', font: 'Montserrat', darkMode: true },
    sections: [
      { type: 'hero', content: { layout: 'centered', badge: 'The Editorial Standard', title: 'Precision in Every Detail.', description: 'Tailored experiences for the discerning collector.', ctaText: 'Explore Services', secondaryCtaText: 'View Gallery', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80' }, order: 0 },
      { type: 'features', content: { title: 'Investment Tiers', items: [{ title: 'Silver Standard', price: '299' }, { title: 'Gold Signature', price: '850', isPopular: true }] }, order: 1 },
      { type: 'contact', content: { title: 'Secure Your Appointment', description: 'Our studio operates by appointment only.', phone: '+1 (310) ELITE-SV', email: 'concierge@elite.com' }, order: 2 }
    ]
  }
];