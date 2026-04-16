import React from 'react';
import { Quote } from 'lucide-react';
import EditableText from '../../builder/components/EditableText';

/**
 * ModularPitch: Sección de impacto emocional y prueba social (screen.png).
 */
const ModularPitch = ({ content, theme = {}, isPreview = false }) => {
  const { 
    text = "ModularBusiness transformó nuestra forma de operar. No solo integramos los datos, sino que finalmente tenemos una visión clara y modular de hacia dónde se dirige nuestra empresa.",
    author = "Elena Rodríguez",
    role = "CEO, TechStream Logistics",
    avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80"
  } = content;

  return (
    <div className="py-32 px-8 bg-slate-50 flex flex-col items-center text-center font-sans overflow-hidden relative">
      <Quote className="text-indigo-600/10 w-48 h-48 absolute top-10 -translate-y-1/2 scale-[2.5]" />
      
      <div className="max-w-4xl mx-auto space-y-16 relative z-10">
        <div className="w-16 h-1 bg-indigo-600 mx-auto rounded-full" />
        
        <EditableText 
          field="text" 
          value={text} 
          as="blockquote" 
          className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight italic" 
          isPreview={isPreview} 
        />

        <div className="flex flex-col items-center gap-6 pt-4">
          <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-indigo-50">
            <img src={avatar} alt={author} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <EditableText field="author" value={author} as="p" className="text-xl font-black text-slate-900 tracking-tighter uppercase" isPreview={isPreview} />
            <EditableText field="role" value={role} as="p" className="text-sm font-bold text-indigo-600 uppercase tracking-widest" isPreview={isPreview} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModularPitch;