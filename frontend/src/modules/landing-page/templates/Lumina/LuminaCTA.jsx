import React from 'react';
import EditableText from '../../builder/components/EditableText';

const LuminaCTA = ({ content, isPreview = false }) => {
  const { 
    title = 'Keep your pulse on minimalism.',
    description = 'Receive curated insights on design, architecture, and intentional living twice a month.',
    buttonText = 'Subscribe'
  } = content;

  return (
    <div className="py-40 px-12 lg:px-24 bg-slate-50 font-serif">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        <div className="space-y-6">
           <EditableText field="title" value={title} as="h2" className="text-4xl md:text-5xl font-medium tracking-tight text-slate-950" isPreview={isPreview} />
           <EditableText field="description" value={description} as="p" className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed" isPreview={isPreview} />
        </div>

        <form className="flex flex-col md:flex-row items-center gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
           <input 
             type="email" 
             placeholder="Enter your email address" 
             className="flex-1 w-full bg-white border border-slate-200 px-8 py-5 text-sm outline-none focus:border-slate-900 transition-colors rounded-none" 
           />
           <button className="w-full md:w-auto px-12 py-5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-xl">
             <EditableText field="buttonText" value={buttonText} as="span" isPreview={isPreview} />
           </button>
        </form>
      </div>
    </div>
  );
};

export default LuminaCTA;