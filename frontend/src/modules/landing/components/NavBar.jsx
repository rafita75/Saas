import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ModularBusiness
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 transition">
              Características
            </button>
            <button onClick={() => scrollToSection('modules')} className="text-gray-600 hover:text-gray-900 transition">
              Módulos
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-gray-900 transition">
              Precios
            </button>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 transition">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Comenzar Gratis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-3">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-gray-600 py-2">
              Características
            </button>
            <button onClick={() => scrollToSection('modules')} className="block w-full text-left text-gray-600 py-2">
              Módulos
            </button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left text-gray-600 py-2">
              Precios
            </button>
            <Link to="/login" className="block text-gray-600 py-2">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg">
              Comenzar Gratis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};