import React from 'react';

/**
 * ModularInfoSection: Diseño asimétrico con texto e imagen/mockup.
 * Réplica de "Arquitectura de Datos Modular" de Stitch.
 */
const ModularInfoSection = ({ content, theme = {}, reversed = false }) => {
  const { 
    title = 'Arquitectura de Datos Modular',
    description = 'No pague por lo que no necesita. Nuestra estructura le permite activar o desactivar módulos de datos según el crecimiento de su organización.',
    image = 'https://images.unsplash.com/photo-1551288049-bbda48642a4c?auto=format&fit=crop&q=80',
    stats = [
      { label: 'Uptime Garantizado', value: '99.9%' },
      { label: 'Latencia de Respuesta', value: '0.1s' }
    ]
  } = content;

  return (
    <div className={`py-32 px-8 ${theme.font ? `font-${theme.font.toLowerCase().replace(' ', '-')}` : ''}`}>
      <div className={`max-w-7xl mx-auto flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20`}>
        
        {/* Text Content */}
        <div className="lg:w-1/2 space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{title}</h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xl">{description}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-1">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image/Mockup */}
        <div className="lg:w-1/2 relative group">
          <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl opacity-50" />
          <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
            <img src={image} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModularInfoSection;