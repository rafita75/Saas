import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = '50237674506';
  const message = encodeURIComponent('Hola, necesito asesoría sobre ModularBusiness');
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed bottom-6 right-6 z-50
        bg-linear-to-r from-green-500 to-green-600
        p-4 rounded-full shadow-lg
        transition-all duration-500
        hover:scale-110 hover:shadow-2xl
        animate-float
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
    >
      <MessageCircle className="w-6 h-6 text-white" />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
    </a>
  );
};