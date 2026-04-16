import React from 'react';
import EditableText from '../../builder/components/EditableText';

const LuminaHero = ({ content, isPreview = false }) => {
  const { 
    title = 'The Architecture of Comfort.',
    description = 'Curated pieces for the modern home.',
    ctaText = 'Shop Collection',
    image = 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80'
  } = content;

  return (
    <div className="relative h-screen min-h-[800px] flex items-center justify-center font-serif overflow-hidden">
      {/* Background Image with Parallax effect simulation */}
      <div className="absolute inset-0 z-0">
        <img src={image} alt="Hero" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-12 px-8 max-w-5xl animate-in fade-in zoom-in duration-1000">
        <div className="space-y-4">
           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 drop-shadow-sm">Autumn / Winter 2024</p>
           <EditableText 
             field="title" 
             value={title} 
             as="h1" 
             className="text-6xl md:text-[7rem] font-medium leading-[0.9] text-slate-950 tracking-tight" 
             isPreview={isPreview} 
           />
        </div>

        <div className="space-y-10">
           <EditableText 
             field="description" 
             value={description} 
             as="p" 
             className="text-xl md:text-2xl text-slate-800 font-medium tracking-wide" 
             isPreview={isPreview} 
           />
           <div className="pt-4">
              <button className="px-12 py-5 bg-slate-950 text-white text-xs font-black uppercase tracking-[0.3em] hover:bg-white hover:text-slate-950 transition-all duration-500 border border-slate-950">
                 <EditableText field="ctaText" value={ctaText} as="span" isPreview={isPreview} />
              </button>
           </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-px h-24 bg-slate-900/20">
         <div className="w-full h-1/2 bg-slate-900 animate-bounce" />
      </div>
    </div>
  );
};

export default LuminaHero;