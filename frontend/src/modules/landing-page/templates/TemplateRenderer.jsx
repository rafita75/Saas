import React from 'react';

// Modular Templates
import ModularHero from './Modular/ModularHero';
import ModularPricing from './Modular/ModularPricing';
import ModularInfoSection from './Modular/ModularInfoSection';
import ModularPitch from './Modular/ModularPitch';
import ModularContact from './Modular/ModularContact';
import ModularNav from './Modular/ModularNav';
import ModularFooter from './Modular/ModularFooter';

// Lumina Templates
import LuminaHero from './Lumina/LuminaHero';
import LuminaFeatures from './Lumina/LuminaFeatures';
import LuminaCTA from './Lumina/LuminaCTA';
import LuminaNav from './Lumina/LuminaNav';
import LuminaFooter from './Lumina/LuminaFooter';

// Elite Templates
import EliteHero from './Elite/EliteHero';
import EliteBento from './Elite/EliteBento';
import EliteContact from './Elite/EliteContact';
import EliteNav from './Elite/EliteNav';
import EliteFooter from './Elite/EliteFooter';

/**
 * TemplateRenderer: El cerebro del renderizado por marca.
 */
const TemplateRenderer = ({ templateId = 'modular', section, idx, isPreview = false, onSectionClick, isSelected = false, theme = {}, handleAction }) => {
  if (!section || !section.content) return null;

  const props = { content: section.content, theme, handleAction, isPreview };

  const TEMPLATES = {
    modular: {
      hero: ModularHero,
      pricing: ModularPricing,
      info: ModularInfoSection,
      pitch: ModularPitch,
      contact: ModularContact,
      features: ModularInfoSection, 
    },
    lumina: {
      hero: LuminaHero,
      features: LuminaFeatures,
      cta: LuminaCTA,
      pricing: LuminaFeatures, 
      contact: LuminaCTA, 
    },
    elite: {
      hero: EliteHero,
      features: EliteBento,
      contact: EliteContact,
      pricing: EliteBento, // Fallback
      cta: EliteHero, // Fallback
    }
  };

  const Component = TEMPLATES[templateId]?.[section.type] || (() => <div className="p-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] text-slate-500 uppercase tracking-widest text-[10px] font-black">Bloque {section.type} en construcción</div>);

  const containerClass = `relative transition-all duration-500 ${isPreview ? 'cursor-pointer' : ''} ${
    isSelected ? 'ring-8 ring-indigo-600 ring-inset z-20 bg-indigo-600/5' : ''
  }`;

  return (
    <section className={containerClass} onClick={() => onSectionClick?.(idx)}>
      <Component {...props} />
    </section>
  );
};

export { ModularNav, ModularFooter, LuminaNav, LuminaFooter, EliteNav, EliteFooter, TemplateRenderer };