import React from 'react';
import EditableText from '../../builder/components/EditableText';

const EliteBento = ({ content, isPreview = false }) => {
  const { 
    title = 'Tailored experiences for the discerning collector.',
    items = [
      { title: 'Diamond Detailing', description: 'Our signature service involving a 48-step process of purification and protection.', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80' },
      { title: 'Ceramic Coating', description: 'Multi-layer hydrophobic protection that chemically bonds to your factory paint.', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80' }
    ]
  } = content;

  return (
    <div className="py-40 bg-zinc-950 font-sans">
      <div className="max-w-7xl mx-auto px-12 space-y-32">
        <div className="max-w-3xl border-l border-amber-500/30 pl-12">
           <EditableText field="title" value={title} as="h2" className="text-4xl md:text-5xl font-medium text-white leading-tight" isPreview={isPreview} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           {items.map((item, idx) => (
             <div key={idx} className="group relative aspect-square md:aspect-[4/5] overflow-hidden rounded-3xl">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 space-y-4 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                   <EditableText itemIdx={idx} itemField="title" value={item.title} as="h3" className="text-3xl font-bold text-white tracking-tighter" isPreview={isPreview} />
                   <EditableText itemIdx={idx} itemField="description" value={item.description} as="p" className="text-slate-400 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700" isPreview={isPreview} />
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default EliteBento;