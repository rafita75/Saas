import React from 'react';
import { ArrowRight } from 'lucide-react';
import EditableText from '../../builder/components/EditableText';

/**
 * ModularHero: Réplica 1:1 del diseño SaaS de Stitch (screen.png).
 */
const ModularHero = ({ content, theme = {}, handleAction, isPreview = false }) => {
  const { 
    badge = 'POWERED BY J&M SYSTEMS',
    title = 'La estructura modular para el éxito empresarial.',
    description = 'Escala tu negocio con precisión digital. Nuestra arquitectura permite una integración fluida de procesos y datos en un solo ecosistema coherente.',
    ctaText = 'Agendar Demo',
    secondaryCtaText = 'Ver Módulos',
    image = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
    layout = 'split' // 'split' (right), 'reversed' (left), 'centered'
  } = content;

  const primaryColor = theme.primaryColor || '#4f46e5';
  const bgColor = theme.backgroundColor || '#ffffff';
  const textColor = theme.textColor || '#0f172a';

  const isReversed = layout === 'reversed';
  const isCentered = layout === 'centered';

  return (
    <div 
      className={`relative pt-24 lg:pt-32 pb-20 px-8 lg:px-20 font-sans transition-colors duration-500`}
      style={{ backgroundColor: bgColor }}
    >
      <div className={`max-w-7xl mx-auto flex flex-col ${isCentered ? 'items-center text-center' : (isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row')} items-center gap-16 lg:gap-24`}>
        
        {/* Text Content */}
        <div className={`${isCentered ? 'w-full max-w-4xl' : 'lg:w-3/5'} space-y-10 ${isCentered ? 'text-center' : 'text-left'}`}>
          <div 
            className="inline-block px-4 py-1.5 rounded-full border"
            style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}20` }}
          >
            <EditableText field="badge" value={badge} as="span" className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: primaryColor }} isPreview={isPreview} />
          </div>

          <EditableText 
            field="title" 
            value={title} 
            as="h1" 
            className="text-6xl lg:text-[5.5rem] font-bold leading-[0.95] tracking-tight" 
            style={{ color: textColor }}
            isPreview={isPreview} 
          />

          <EditableText 
            field="description" 
            value={description} 
            as="p" 
            className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0" 
            isPreview={isPreview} 
          />

          <div className={`flex flex-wrap gap-4 pt-4 ${isCentered ? 'justify-center' : ''}`}>
            <button 
              className="px-10 py-5 text-white rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-95"
              style={{ backgroundColor: primaryColor, shadowColor: `${primaryColor}40` }}
            >
              <EditableText field="ctaText" value={ctaText} as="span" isPreview={isPreview} />
            </button>
            <button className="px-10 py-5 bg-slate-100 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all">
              <EditableText field="secondaryCtaText" value={secondaryCtaText} as="span" isPreview={isPreview} />
            </button>
          </div>
        </div>

        {/* Visual Mockup */}
        {!isCentered && (
          <div className="lg:w-2/5 relative group">
            <div className="absolute -inset-4 rounded-[3rem] blur-3xl opacity-50" style={{ backgroundColor: `${primaryColor}15` }} />
            <div className="relative aspect-[4/3] lg:aspect-square bg-white rounded-[3rem] border border-slate-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
              <img src={image} alt="Dashboard Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>

      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto mt-24 lg:mt-32 pt-12 border-t border-slate-100 flex flex-wrap justify-between items-center gap-12 opacity-30 grayscale pointer-events-none">
        {['SEGURIDAD TOTAL', 'VELOCIDAD EXTREMA', 'ESCALABILIDAD', 'SINCRONIZACIÓN'].map((text) => (
          <span key={text} className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: textColor }}>{text}</span>
        ))}
      </div>
    </div>
  );
};

export default ModularHero;