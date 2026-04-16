import React from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import EditableText from '../../builder/components/EditableText';

const EliteContact = ({ content, isPreview = false }) => {
  const { 
    title = 'Secure Your Appointment',
    description = 'Our studio operates by appointment only to ensure each vehicle receives undivided attention.',
    email = 'concierge@elite-editorial.com',
    phone = '+1 (310) ELITE-SV',
    address = '1422 Industrial District, Los Angeles, CA'
  } = content;

  return (
    <div className="py-40 bg-black font-sans px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-32">
        
        {/* Contact Info */}
        <div className="lg:w-2/5 space-y-16">
          <div className="space-y-6">
             <EditableText field="title" value={title} as="h2" className="text-5xl font-bold text-white tracking-tighter" isPreview={isPreview} />
             <EditableText field="description" value={description} as="p" className="text-slate-500 text-lg leading-relaxed max-w-sm" isPreview={isPreview} />
          </div>

          <div className="space-y-10 pt-8 border-t border-white/5">
             <div className="flex items-center gap-6">
                <MapPin className="text-amber-500" size={20} />
                <EditableText field="address" value={address} as="p" className="text-sm font-bold uppercase tracking-widest text-slate-300" isPreview={isPreview} />
             </div>
             <div className="flex items-center gap-6">
                <Phone className="text-amber-500" size={20} />
                <EditableText field="phone" value={phone} as="p" className="text-sm font-bold uppercase tracking-widest text-slate-300" isPreview={isPreview} />
             </div>
             <div className="flex items-center gap-6">
                <Mail className="text-amber-500" size={20} />
                <EditableText field="email" value={email} as="p" className="text-sm font-bold uppercase tracking-widest text-slate-300" isPreview={isPreview} />
             </div>
          </div>
        </div>

        {/* Minimal Form */}
        <div className="lg:w-3/5">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Full Name</label>
                <input type="text" className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-white outline-none focus:border-amber-500 transition-all rounded-none" placeholder="Elias Vance" />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Email Address</label>
                <input type="email" className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-white outline-none focus:border-amber-500 transition-all rounded-none" placeholder="vance@private.com" />
             </div>
             <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Vehicle Make & Model</label>
                <input type="text" className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-white outline-none focus:border-amber-500 transition-all rounded-none" placeholder="2024 Porsche 911 GT3" />
             </div>
             <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Message / Special Requests</label>
                <textarea rows={4} className="w-full bg-white/[0.02] border border-white/10 px-6 py-4 text-white outline-none focus:border-amber-500 transition-all rounded-none resize-none" placeholder="Details about specific requirements..." />
             </div>
             <button className="md:col-span-2 py-6 bg-amber-500 text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-[0_30px_60px_rgba(245,158,11,0.15)]">
                Request Private Consult
             </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default EliteContact;