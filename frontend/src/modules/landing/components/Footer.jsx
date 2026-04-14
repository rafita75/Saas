import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
import { MapPin, Phone, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative bg-dark-950 border-t border-primary/10 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h3 className="text-2xl font-bold text-gradient">ModularBusiness</h3>
                <p className="text-xs text-slate-400">by J&H Systems</p>
              </div>
            </div>
            <p className="text-slate-400 mb-4 text-sm">
              El sistema todo en uno para gestionar tu negocio de forma eficiente. 
              Hecho con ❤️ en Guatemala.
            </p>
            <div className="flex space-x-3">
              <SocialIcon url="https://facebook.com" style={{ height: 36, width: 36 }} bgColor="transparent" fgColor="#9CA3AF" className="hover:scale-110 transition" />
              <SocialIcon url="https://instagram.com" style={{ height: 36, width: 36 }} bgColor="transparent" fgColor="#9CA3AF" className="hover:scale-110 transition" />
              <SocialIcon url="https://twitter.com" style={{ height: 36, width: 36 }} bgColor="transparent" fgColor="#9CA3AF" className="hover:scale-110 transition" />
              <SocialIcon url="https://linkedin.com" style={{ height: 36, width: 36 }} bgColor="transparent" fgColor="#9CA3AF" className="hover:scale-110 transition" />
            </div>
          </div>
          
          {/* Producto */}
          <div>
            <h4 className="font-semibold text-white mb-4">Producto</h4>
            <ul className="space-y-2">
              <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white transition text-sm">Características</button></li>
              <li><button onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white transition text-sm">Módulos</button></li>
              <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white transition text-sm">Precios</button></li>
              <li><Link to="/blog" className="text-slate-400 hover:text-white transition text-sm">Blog</Link></li>
            </ul>
          </div>
          
          {/* Soporte */}
          <div>
            <h4 className="font-semibold text-white mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-slate-400 hover:text-white transition text-sm">Contacto</Link></li>
              <li><Link to="/docs" className="text-slate-400 hover:text-white transition text-sm">Documentación</Link></li>
              <li><Link to="/faq" className="text-slate-400 hover:text-white transition text-sm">FAQ</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-white transition text-sm">Acerca de</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-slate-400 hover:text-white transition text-sm">Privacidad</Link></li>
              <li><Link to="/terms" className="text-slate-400 hover:text-white transition text-sm">Términos</Link></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-slate-400 text-sm mb-3">
              Recibe noticias y ofertas exclusivas
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 px-4 py-2 bg-dark-800 border border-primary/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                required
              />
              <button
                type="submit"
                className="bg-linear-to-r from-primary to-secondary p-2 rounded-lg hover:glow-effect transition"
              >
                <ArrowRight size={20} className="text-white" />
              </button>
            </form>
            {subscribed && (
              <p className="text-green-400 text-xs mt-2 animate-fade-in">
                ✅ ¡Gracias por suscribirte!
              </p>
            )}
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="glass-light rounded-xl p-4 mb-8 grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-primary" />
            <span className="text-slate-300">Ciudad de Guatemala, Guatemala</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={18} className="text-primary" />
            <a href="tel:+50237674506" className="text-slate-300 hover:text-white transition">
              +502 3767-4506
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-primary" />
            <a href="mailto:estudiosjuarez25@gmail.com" className="text-slate-300 hover:text-white transition">
              estudiosjuarez25@gmail.com
            </a>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} J&H Systems. Todos los derechos reservados.
          </p>
          <p className="text-slate-500 text-xs">
            Desarrollado con tecnología de punta en Guatemala 🇬🇹
          </p>
        </div>
      </div>
    </footer>
  );
};