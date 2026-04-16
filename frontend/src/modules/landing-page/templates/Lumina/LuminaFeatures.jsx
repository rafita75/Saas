import React from 'react';
import EditableText from '../../builder/components/EditableText';

const LuminaFeatures = ({ content, isPreview = false }) => {
  const { 
    title = 'Essential Silhouettes',
    items = [
      { title: 'Orbital Ceramic Vase', description: '$124.00', image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80' },
      { title: 'Alpine Lounge Chair', description: '$1,850.00', image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80' },
      { title: 'Linear Brass Floor Lamp', description: '$440.00', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80' },
      { title: 'Stone-Washed Linen Set', description: '$310.00', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80' }
    ]
  } = content;

  return (
    <div className="py-40 px-12 lg:px-24 bg-white font-serif">
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="flex items-end justify-between border-b border-slate-100 pb-8">
           <EditableText field="title" value={title} as="h2" className="text-4xl md:text-5xl font-medium tracking-tight text-slate-950" isPreview={isPreview} />
           <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">View All</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
           {items.map((item, idx) => (
             <div key={idx} className="group space-y-6">
                <div className="aspect-[3/4] bg-slate-50 overflow-hidden relative">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="space-y-1">
                   <EditableText itemIdx={idx} itemField="title" value={item.title} as="h3" className="text-sm font-bold tracking-widest uppercase text-slate-900" isPreview={isPreview} />
                   <EditableText itemIdx={idx} itemField="description" value={item.description} as="p" className="text-sm text-slate-400 font-medium" isPreview={isPreview} />
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default LuminaFeatures;