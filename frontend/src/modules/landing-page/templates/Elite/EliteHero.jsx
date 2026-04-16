import React from 'react';
import EditableText from '../../builder/components/EditableText';

const EliteHero = ({ content, isPreview = false }) => {
  const { 
    badge = 'THE EDITORIAL STANDARD',
    title = 'Precision in Every Detail.',
    description = 'Tailored experiences for the discerning collector. We define the future of automotive luxury.',
    ctaText = 'Explore Services',
    image = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80'
  } = content;

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans overflow-hidden bg-black py-32">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img src={image} alt="Elite Hero" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 text-center space-y-10 px-8 max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-4">
           <div className="flex items-center justify-center gap-4">
              <div className="h-px w-8 bg-amber-500/50" />
              <EditableText field="badge" value={badge} as="span" className="text-[10px] font-black uppercase tracking-[0.6em] text-amber-500" isPreview={isPreview} />
              <div className="h-px w-8 bg-amber-500/50" />
           </div>
           <EditableText 
             field="title" 
             value={title} 
             as="h1" 
             className="text-6xl md:text-[8rem] font-bold leading-none text-white tracking-tighter" 
             isPreview={isPreview} 
           />
        </div>

        <div className="space-y-12">
           <EditableText 
             field="description" 
             value={description} 
             as="p" 
             className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed" 
             isPreview={isPreview} 
           />
           <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <button className="px-12 py-5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-[0_20px_50px_rgba(245,158,11,0.2)]">
                 <EditableText field="ctaText" value={ctaText} as="span" isPreview={isPreview} />
              </button>
              <button className="px-12 py-5 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                 View Gallery
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EliteHero;