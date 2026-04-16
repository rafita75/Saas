# Plan: Módulo Landing Page - Arquitectura de Planes y Contenido

## 1. Objetivo
Implementar el módulo de **Landing Page** con una estructura de 5 niveles de planes (Gratis, Básico, Pro, Ultra, Empresa). El sistema debe ser capaz de limitar funciones (ej: número de páginas, secciones, personalización) basándose en el plan activo del suscriptor.

## 2. Estructura de Datos (Backend)

### A. Extensión de Modelos Core
- **`ModulePlan`**: Actualizaremos el objeto `limits` para incluir las restricciones específicas de Landing Page:
    - `maxPages`: Número de landing pages permitidas.
    - `maxSections`: Secciones máximas por página.
    - `hasCustomDomain`: (Boolean) Permite usar dominios propios.
    - `templatesLevel`: (Number/Enum) 0: Básico, 1: Estándar, 2: Premium.
    - `canEditCSS`: (Boolean) Acceso a edición de estilos avanzada.

### B. Modelo del Módulo (`models/LandingPage.js`)
- `tenantId`: Referencia al negocio.
- `name`: Nombre interno de la página.
- `path`: URL relativa (ej: `/promocion-verano`).
- `seo`: `{ title, description, keywords, ogImage }`.
- `sections`: Array de objetos dinámicos:
    - `type`: 'hero', 'features', 'pricing', 'contact', etc.
    - `content`: JSON con los textos, imágenes y configuraciones de esa sección.
    - `order`: Orden de visualización.
- `isActive`: Boolean.

## 3. Arquitectura Frontend (Modular)

Ubicación: `frontend/src/modules/landing-page/`

### A. Estructura de Carpetas
- `manifest.js`: Configura el Sidebar, Rutas y Metadata del módulo.
- `components/`: Componentes de secciones (Hero, Features, PricingTable).
- `pages/`:
    - `LandingManager.jsx`: Lista de páginas creadas.
    - `LandingEditor.jsx`: El "constructor" de la página.
    - `LandingSettings.jsx`: Configuración de SEO y Dominio.
- `hooks/`: `useLandingLimits.js` para validar qué puede hacer el usuario según su plan.

## 4. Implementación de Limitaciones (Feature Gating)

Crearemos un componente `<LandingFeatureGate />` que:
1. Verifique el plan actual del módulo.
2. Compare la acción deseada (ej: añadir sección) contra los límites del plan.
3. Bloquee o muestre un mensaje de "Upgrade" si se alcanza el límite.

## 5. Fases de Trabajo

### Fase 1: Inicialización
- Crear carpeta `plans/modules/`.
- Guardar este documento en `plans/modules/landing-page.md`.
- Crear script de Seed para los 5 planes con sus precios y límites reales.

### Fase 2: Backend
- Implementar el modelo `LandingPage`.
- Crear controladores CRUD con validaciones de límites de plan.

### Fase 3: Frontend - El Editor
- Crear el manifiesto del módulo.
- Implementar el editor de secciones (Drag & Drop o Lista ordenada).
- Integrar con Cloudinary para las imágenes de las secciones.

### Fase 4: Vista Pública Real
- Actualizar `PublicLanding.jsx` para que sea dinámico.
- Debe renderizar las secciones guardadas en la DB aplicando el tema elegido.

## 6. Verificación
- Un usuario "Gratis" no puede crear más de 1 página.
- Un usuario "Básico" puede crear hasta 3 páginas.
- Un usuario "Ultra" puede activar el modo oscuro y animaciones.