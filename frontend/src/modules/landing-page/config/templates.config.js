export const LANDING_TEMPLATES = [
  {
    id: 'consulting',
    name: 'Consultoría Elite',
    level: 'gratis',
    description: 'Diseño minimalista y autoritario.',
    theme: { primaryColor: '#6366f1', secondaryColor: '#4338ca', font: 'Inter', darkMode: true },
    sections: [
      { type: 'hero', content: { layout: 'split', badge: 'Estrategia', title: 'Escala tu empresa', description: 'Duplica tu rentabilidad con asesoría experta.', ctaText: 'Agendar Sesión', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80', action: { type: 'whatsapp', value: '50200000000' } }, order: 0 },
      { type: 'features', content: { title: 'Metodología', items: [{ title: 'Auditoría 360', description: 'Fugas de capital.' }, { title: 'Automatización', description: 'Tecnología real.' }] }, order: 1 },
      { type: 'testimonials', content: { title: 'Éxitos', items: [{ title: 'CEO Logis', description: 'Resultados récord.' }] }, order: 2 },
      { type: 'contact', content: { title: '¿Hablamos?', description: 'Soluciones a medida.', email: 'info@elite.com', phone: '+502 1234 5678' }, order: 3 }
    ]
  },
  {
    id: 'gourmet',
    name: 'Sabor de Autor',
    level: 'gratis',
    description: 'Impactante y visual para restaurantes.',
    theme: { primaryColor: '#f59e0b', secondaryColor: '#78350f', font: 'Playfair Display', darkMode: true },
    sections: [
      { type: 'hero', content: { layout: 'background', title: 'El Arte del Sabor', description: 'Tradición y vanguardia culinaria.', ctaText: 'Reservar Mesa', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80', action: { type: 'whatsapp', value: '50200000000' } }, order: 0 },
      { type: 'features', content: { title: 'Experiencia Signature', items: [{ title: 'Origen Local', description: 'Frescura total.' }, { title: 'Chef de Autor', description: 'Único.' }] }, order: 1 },
      { type: 'cta', content: { title: 'Noche Inolvidable', description: 'Asegura tu lugar hoy.', buttonText: 'Consultar WhatsApp', action: { type: 'whatsapp', value: '50200000000' } }, order: 2 },
      { type: 'contact', content: { title: 'Visítanos', description: '12:00 PM - 11:00 PM', phone: '+502 8888 7777', email: 'reservas@gourmet.com' }, order: 3 }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS Launch',
    level: 'gratis',
    description: 'Centrado en la conversión de usuarios.',
    theme: { primaryColor: '#0ea5e9', secondaryColor: '#312e81', font: 'Montserrat', darkMode: false },
    sections: [
      { type: 'hero', content: { layout: 'centered', badge: 'v2.0 Live', title: 'Automatiza tu Éxito', description: 'Gestiona tu negocio sin complicaciones.', ctaText: 'Empezar Gratis', action: { type: 'link', value: '/register' } }, order: 0 },
      { type: 'features', content: { title: 'Productividad', items: [{ title: 'Fácil Uso', description: 'Interfaz intuitiva.' }, { title: 'Seguridad', description: 'Nube blindada.' }] }, order: 1 },
      { type: 'testimonials', content: { title: 'Testimonios', items: [{ title: 'Marketing Pro', description: '50% más eficientes.' }] }, order: 2 },
      { type: 'cta', content: { title: '¿Listo?', description: 'Únete a 5,000 negocios.', buttonText: 'Crear cuenta', action: { type: 'link', value: '/register' } }, order: 3 }
    ]
  }
];