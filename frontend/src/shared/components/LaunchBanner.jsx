import { Rocket, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export const LaunchBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 animate-fade-in-up"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className={`
          glass rounded-2xl p-4 border border-primary/30 shadow-2xl
          transition-all duration-300
          ${isHovered ? 'glow-effect scale-[1.02]' : ''}
        `}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left - Icon and Message */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary/30 to-secondary/30 flex items-center justify-center animate-pulse">
                <Rocket size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-white font-medium flex items-center gap-2">
                  <Sparkles size={14} className="text-yellow-400" />
                  Estamos en fase de lanzamiento
                  <Sparkles size={14} className="text-yellow-400" />
                </p>
                <p className="text-slate-400 text-sm">
                  Algunos módulos y planes estarán disponibles próximamente. ¡Sé de los primeros en probarlos!
                </p>
              </div>
            </div>
            
            {/* Right - CTA and Close */}
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/50237674506"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:glow-effect transition-all duration-300 flex items-center gap-2"
              >
                <span>📋 Sugerir módulo</span>
              </a>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 rounded-lg hover:bg-dark-800 transition text-slate-400 hover:text-white"
                aria-label="Cerrar banner"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};