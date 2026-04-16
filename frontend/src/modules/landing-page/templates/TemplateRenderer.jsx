import React from 'react';

// Modular Templates
import ModularHero from './Modular/ModularHero';
import ModularPricing from './Modular/ModularPricing';
import ModularInfoSection from './Modular/ModularInfoSection';
import ModularPitch from './Modular/ModularPitch';
import ModularContact from './Modular/ModularContact';
import ModularNav from './Modular/ModularNav';
import ModularFooter from './Modular/ModularFooter';

// Lumina Templates (To be implemented)
// Elite Templates (To be implemented)

/**
 * TemplateRenderer: El cerebro del renderizado por marca.
 * Detecta qué plantilla se debe usar y carga los componentes correspondientes.
 */
const TemplateRenderer = ({ templateId = 'modular', section, idx, isPreview = false, onSectionClick, isSelected = false, theme = {}, handleAction }) => {
  if (!section || !section.content) return null;

  const props = { content: section.content, theme, handleAction, isPreview };

  // Diccionario de componentes por plantilla
  const TEMPLATES = {
    modular: {
      hero: ModularHero,
      pricing: ModularPricing,
      info: ModularInfoSection,
      pitch: ModularPitch,
      contact: ModularContact,
      features: ModularInfoSection, // Fallback mientras creamos Bento
    },
    lumina: {
      // Proximamente
    },
    elite: {
      // Proximamente
    }
  };

  const Component = TEMPLATES[templateId]?.[section.type] || (() => <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem]">Componente {section.type} en construcción para {templateId}</div>);

  const containerClass = `relative transition-all duration-500 ${isPreview ? 'cursor-pointer' : ''} ${
    isSelected ? 'ring-8 ring-indigo-600 ring-inset z-20 bg-indigo-50/30' : ''
  }`;

  return (
    <section className={containerClass} onClick={() => onSectionClick?.(idx)}>
      <Component {...props} />
    </section>
  );
};

export { ModularNav, ModularFooter, TemplateRenderer };