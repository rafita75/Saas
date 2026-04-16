import LandingManager from './pages/LandingManager';
import LandingEditor from './pages/LandingEditor';
import { Globe, Layout, Settings } from 'lucide-react';

/**
 * Manifiesto del Módulo de Landing Page
 * Define cómo se integra el módulo en el Core del SaaS
 */
export const LandingPageModule = {
  id: 'landing-page',
  name: 'Landing Page',
  slug: 'landing-page',
  icon: Globe,
  description: 'Crea y personaliza páginas de aterrizaje para captar clientes.',
  
  // Rutas que este módulo inyecta en el dashboard
  routes: [
    {
      path: 'landings',
      element: LandingManager,
      label: 'Mis Páginas',
      icon: Layout
    },
    {
      path: 'landings/new',
      element: LandingEditor,
      hidden: true // No aparece en el menú lateral
    },
    {
      path: 'landings/:id/edit',
      element: LandingEditor,
      hidden: true
    }
  ],

  // Permisos requeridos para ver este módulo en el sidebar
  permissions: ['manage_landing'],
  
  // Niveles de acceso por plan (referencia para el frontend)
  features: {
    maxPages: {
      gratis: 1,
      basico: 3,
      pro: 10,
      ultra: 30,
      empresa: 9999
    },
    hasCustomDomain: ['pro', 'ultra', 'empresa'],
    canEditCSS: ['pro', 'ultra', 'empresa']
  }
};

export default LandingPageModule;