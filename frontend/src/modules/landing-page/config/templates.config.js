/**
 * Configuración de Plantillas predefinidas para el Módulo de Landing Page
 */
export const LANDING_TEMPLATES = [
  {
    id: 'basic-business',
    name: 'Negocio Moderno',
    level: 'gratis',
    description: 'Una plantilla limpia y profesional ideal para servicios y pequeñas empresas.',
    thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1611000000/sample.jpg', // Placeholder
    theme: {
      primaryColor: '#6366f1', // Indigo 500
      secondaryColor: '#f43f5e', // Rose 500
      font: 'Inter',
      darkMode: true
    },
    sections: [
      {
        type: 'hero',
        content: {
          title: 'Impulsa tu negocio con tecnología',
          description: 'Soluciones innovadoras para empresas que buscan crecer en la era digital.',
          ctaText: 'Comenzar Ahora',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80'
        },
        order: 0
      },
      {
        type: 'features',
        content: {
          title: 'Nuestros Servicios',
          items: [
            { title: 'Alta Velocidad', description: 'Nuestros sistemas están optimizados para el máximo rendimiento.' },
            { title: 'Seguridad Total', description: 'Protegemos tus datos con los más altos estándares.' },
            { title: 'Soporte 24/7', description: 'Estamos aquí para ayudarte en cualquier momento.' }
          ]
        },
        order: 1
      },
      {
        type: 'contact',
        content: {
          title: 'Contáctanos',
          description: 'Estamos listos para llevar tu proyecto al siguiente nivel.',
          email: 'contacto@ejemplo.com',
          phone: '+502 0000-0000'
        },
        order: 2
      }
    ]
  },
  {
    id: 'simple-product',
    name: 'Lanzamiento de Producto',
    level: 'gratis',
    description: 'Enfocada en convertir visitantes en compradores de un producto específico.',
    theme: {
      primaryColor: '#0ea5e9', // Cyan 500
      secondaryColor: '#8b5cf6', // Violet 500
      font: 'Inter',
      darkMode: true
    },
    sections: [
      {
        type: 'hero',
        content: {
          title: 'El producto que estabas esperando',
          description: 'Descubre la nueva forma de gestionar tu tiempo y productividad.',
          ctaText: 'Comprar ahora',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80'
        },
        order: 0
      },
      {
        type: 'cta',
        content: {
          title: '¿Listo para el cambio?',
          description: 'Únete a miles de personas que ya están transformando su día a día.',
          buttonText: 'Suscribirse'
        },
        order: 1
      }
    ]
  },
  {
    id: 'personal-brand',
    name: 'Marca Personal',
    level: 'gratis',
    description: 'Muestra tu portafolio y habilidades con un diseño elegante.',
    theme: {
      primaryColor: '#ec4899', // Pink 500
      secondaryColor: '#f97316', // Orange 500
      font: 'Inter',
      darkMode: false
    },
    sections: [
      {
        type: 'hero',
        content: {
          title: 'Soy [Tu Nombre]',
          description: 'Estratega digital y apasionado por crear contenido de alto impacto.',
          ctaText: 'Ver mi trabajo',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80'
        },
        order: 0
      },
      {
        type: 'contact',
        content: {
          title: 'Hablemos de tu idea',
          description: 'Escríbeme para colaborar en proyectos creativos.',
          email: 'yo@ejemplo.com'
        },
        order: 1
      }
    ]
  }
];