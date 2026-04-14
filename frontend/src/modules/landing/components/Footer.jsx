import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">ModularBusiness</h3>
            <p className="text-gray-400 mb-4">
              El sistema todo en uno para gestionar tu negocio de forma eficiente.
            </p>
            <div className="flex space-x-4">
              {/* SocialIcon YA ES un <a>, no necesita estar dentro de otro <a> */}
              <SocialIcon 
                url="https://facebook.com" 
                style={{ height: 32, width: 32 }} 
                bgColor="transparent"
                fgColor="#9CA3AF"
                className="hover:opacity-80 transition"
              />
              <SocialIcon 
                url="https://instagram.com" 
                style={{ height: 32, width: 32 }}
                bgColor="transparent"
                fgColor="#9CA3AF"
                className="hover:opacity-80 transition"
              />
              <SocialIcon 
                url="https://twitter.com" 
                style={{ height: 32, width: 32 }}
                bgColor="transparent"
                fgColor="#9CA3AF"
                className="hover:opacity-80 transition"
              />
              <SocialIcon 
                url="https://linkedin.com" 
                style={{ height: 32, width: 32 }}
                bgColor="transparent"
                fgColor="#9CA3AF"
                className="hover:opacity-80 transition"
              />
            </div>
          </div>
          
          {/* Producto */}
          <div>
            <h4 className="font-semibold text-white mb-4">Producto</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-gray-400 hover:text-white transition"
                >
                  Características
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-gray-400 hover:text-white transition"
                >
                  Módulos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-gray-400 hover:text-white transition"
                >
                  Precios
                </button>
              </li>
            </ul>
          </div>
          
          {/* Soporte */}
          <div>
            <h4 className="font-semibold text-white mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contacto</Link></li>
              <li><Link to="/docs" className="text-gray-400 hover:text-white transition">Documentación</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacidad</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Términos</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ModularBusiness. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-gray-400">
            <SocialIcon 
              network="email" 
              style={{ height: 32, width: 32 }}
              bgColor="transparent"
              fgColor="#9CA3AF"
              className="hover:opacity-80 transition"
            />
            <a href="mailto:contacto@modularbusiness.com" className="hover:text-white transition">
              contacto@modularbusiness.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};