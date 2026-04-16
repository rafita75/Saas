import LandingPageModule from '../modules/landing-page/manifest';

/**
 * Registro central de módulos del sistema
 * Aquí se deben importar y añadir todos los módulos disponibles.
 */
const MODULES_REGISTRY = [
  LandingPageModule,
  // Aquí iremos agregando: InventoryModule, CRMModule, etc.
];

export default MODULES_REGISTRY;