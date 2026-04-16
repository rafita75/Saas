# Roadmap: Perfeccionamiento de Ecosistema SaaS

## 1. Estado Actual
El sistema cuenta con una base sólida de multi-tenancy, seguridad avanzada (HttpOnly) y un módulo de Landing Page funcional con editor restrictivo para el Plan Gratis y plantillas profesionales.

## 2. Próximos Módulos a Implementar

### A. Módulo de Inventario (Prioridad 1)
- **Objetivo:** Permitir a los negocios gestionar sus productos.
- **Funciones:** CRUD de productos, categorías, gestión de stock básico y subida de imágenes a Cloudinary (aisladas por carpeta de cliente).
- **Integración:** Crear un nuevo bloque "Catálogo" para el editor de Landing Page que consuma estos datos.

### B. Módulo de Equipo Pro (Prioridad 2)
- **Objetivo:** Profesionalizar la gestión de colaboradores.
- **Funciones:** Envío de correos reales de invitación, gestión de permisos granulares por módulo.

### C. Módulo de Tienda / Checkout (Prioridad 3)
- **Objetivo:** Transformar la Landing Page en un E-commerce.
- **Funciones:** Carrito de compras, integración de pagos (Stripe/PayPal) y gestión de órdenes.

## 3. Mejoras Técnicas Pendientes
- **Optimización de Carga:** Implementar Skeleton Loaders en el Dashboard para una carga más fluida.
- **Constructor Drag & Drop:** Empezar el desarrollo del maquetador libre para los planes Pro/Ultra.
- **Global Admin Panel:** Interfaz para el dueño del SaaS (tú) para ver estadísticas de todos los negocios, activar planes manualmente y gestionar el mantenimiento.

## 4. Notas para Mañana
- Revisar feedback del usuario sobre las nuevas plantillas premium.
- Iniciar el diseño del modelo de base de datos para `Products` y `Categories`.