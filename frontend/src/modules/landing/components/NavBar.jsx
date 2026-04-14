import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles, LogIn, ArrowRight } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${scrolled ? 'glass py-2' : 'bg-transparent py-4'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src='../../public/logo.png' width={35}/>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gradient">
                ModularBusiness
              </span>
              <span className="text-xs text-slate-400 -mt-1">
                by J&G Systems
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-white transition">
              Características
            </button>
            <button onClick={() => scrollToSection('modules')} className="text-slate-300 hover:text-white transition">
              Módulos
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="text-slate-300 hover:text-white transition">
              Testimonios
            </button>
            
            {/* Botón Iniciar Sesión - Mejorado */}
            <Link 
              to="/login" 
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-dark-800/50 group"
            >
              <LogIn size={18} className="group-hover:text-primary transition-colors" />
              <span>Iniciar Sesión</span>
            </Link>
            
            {/* Botón Comenzar - Más llamativo */}
            <Link 
              to="/register" 
              className="group relative bg-linear-to-r from-primary to-secondary text-white px-5 py-2.5 rounded-xl font-semibold hover:glow-effect transition-all duration-300 overflow-hidden"
            >
              {/* Efecto shimmer */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative flex items-center gap-2">
                Comenzar
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white p-2" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass m-4 rounded-2xl animate-fade-in-down">
          <div className="px-4 py-6 space-y-4">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-slate-300 py-2">
              Características
            </button>
            <button onClick={() => scrollToSection('modules')} className="block w-full text-left text-slate-300 py-2">
              Módulos
            </button>
            <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left text-slate-300 py-2">
              Testimonios
            </button>
            
            {/* Mobile - Iniciar Sesión */}
            <Link 
              to="/login" 
              className="flex items-center gap-2 text-slate-300 py-2"
            >
              <LogIn size={18} />
              Iniciar Sesión
            </Link>
            
            {/* Mobile - Comenzar */}
            <Link 
              to="/register" 
              className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-primary to-secondary text-white px-4 py-3 rounded-lg font-medium"
            >
              Comenzar Ahora
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};