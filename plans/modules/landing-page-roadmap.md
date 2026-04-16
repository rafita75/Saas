# Roadmap: Evolución del Constructor de Landing Pages

Este documento detalla la estrategia de implementación para escalar el editor de Landing Pages, limitando las capacidades según el plan de suscripción del inquilino (Tenant), desde plantillas fijas hasta un constructor visual completo (Drag & Drop) y creación de plantillas propias.

## 1. Niveles de Acceso por Plan

### Plan Gratis / Básico: Modo "Formulario Rígido"
- **Capacidades:**
  - Seleccionar plantillas predefinidas (diseños fijos).
  - Editar textos, enlaces y subir imágenes (reemplazo).
  - Ocultar secciones predefinidas (pero no eliminarlas o añadir nuevas).
- **Restricciones:** No pueden cambiar el orden de las secciones, no pueden añadir elementos nuevos (ej. agregar un segundo botón a un Hero), no tienen acceso a edición de código/CSS.

### Plan Pro: Modo "Secciones Modulares"
- **Capacidades:**
  - Todo lo del plan Gratis.
  - Añadir nuevas secciones preconstruidas desde una biblioteca (ej. agregar 3 secciones de Testimonios).
  - Reordenar secciones verticales (Drag & Drop a nivel de sección).
  - Cambiar colores principales y tipografías (Theme Engine básico).

### Plan Ultra / Empresa: Modo "Constructor Visual Completo"
- **Capacidades:**
  - Todo lo del plan Pro.
  - **Drag & Drop a nivel de componente:** Arrastrar y soltar elementos individuales (Botones, Cajas de texto, Columnas, Imágenes) dentro o fuera de las secciones.
  - **Plantillas Personalizadas:** Guardar una página construida como una nueva "Plantilla del Tenant" para reusarla en el futuro.
  - Control granular de estilos (espaciados, bordes, sombras).
  - Inyección de código personalizado (Header/Footer scripts).

---

## 2. Arquitectura Técnica (Frontend)

Para lograr esta transición sin reescribir la aplicación tres veces, debemos adoptar una arquitectura de **Árbol de Componentes (AST - Abstract Syntax Tree)** en lugar de simples strings HTML o JSON estáticos.

### 2.1. Librerías Clave a Integrar
1. **Gestión de Estado Complejo:** `zustand` (Para manejar el estado del lienzo, elementos seleccionados, historial de deshacer/rehacer).
2. **Drag & Drop:** `@dnd-kit/core` o `@hello-pangea/dnd` (Optimizados para React, permiten arrastrar tanto en listas como en modo libre).
3. **Validación de Datos:** Seguir usando `Zod` para validar que el JSON generado por el constructor cumpla con la estructura permitida.

### 2.2. Estructura de Datos del Canvas (JSON Schema)
La base de datos (MongoDB) dejará de almacenar simples textos y pasará a almacenar el árbol de nodos:

```json
{
  "id": "hero-section-1",
  "type": "Section",
  "styles": { "backgroundColor": "#ffffff", "padding": "4rem 2rem" },
  "children": [
    {
      "id": "text-1",
      "type": "Heading",
      "content": "Escala tu SaaS",
      "styles": { "fontSize": "4xl", "color": "primary" }
    },
    {
      "id": "button-group-1",
      "type": "Row",
      "children": [
        { "id": "btn-1", "type": "Button", "content": "Empezar", "link": "/register" }
      ]
    }
  ]
}
```

---

## 3. Fases de Implementación

### Fase 1: Consolidar el Modo "Formulario Rígido" (Actualidad -> Corto Plazo)
**Objetivo:** Asegurar que los usuarios Gratis solo puedan editar contenido sin romper los nuevos diseños de Stitch.
1. Implementar los diseños de Stitch como componentes estáticos de React.
2. El `LandingEditor.jsx` debe mostrar el diseño a la derecha y un panel lateral de formularios (inputs) a la izquierda.
3. Bloquear cualquier intento de mover o reestructurar mediante validaciones condicionales basadas en `tenant.plan.slug`.

### Fase 2: Introducir Drag & Drop de Secciones (Plan Pro)
**Objetivo:** Permitir apilar "bloques de lego".
1. Instalar `@dnd-kit`.
2. Envolver la previsualización del editor en un contexto de Sortable.
3. Crear un panel de "Añadir Sección" que inyecte un nuevo objeto de sección al JSON principal.

### Fase 3: El Motor de Renderizado Recursivo y Drag & Drop Profundo (Ultra/Empresa)
**Objetivo:** Control total.
1. Migrar del renderizado estático de secciones a un **Renderizador Recursivo**: Un componente `<BuilderNode />` que lee el JSON y se llama a sí mismo para renderizar hijos.
2. Implementar "Drop Zones" dentro de las secciones vacías o columnas.
3. Crear el panel de "Propiedades Avanzadas" (Margin, Padding, Flexbox) que mapee clases utilitarias de Tailwind dinámicamente.

### Fase 4: Sistema de Plantillas Propias
**Objetivo:** Reusabilidad corporativa.
1. Añadir endpoint en el backend: `POST /api/modules/landing/templates/custom`.
2. Guardar el JSON del árbol actual marcado como `isCustomTemplate: true` y vinculado al `tenantId`.
3. Actualizar la pantalla de selección inicial para inyectar estas plantillas junto a las globales.