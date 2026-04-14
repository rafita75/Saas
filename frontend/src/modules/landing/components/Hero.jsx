import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle size={16} />
              <span>Prueba gratis por 14 días</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              El Sistema que tu Negocio{' '}
              <span className="text-blue-600">Merece</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Crea tu sistema de gestión personalizado. Elige los módulos que necesitas
              y paga solo por lo que usas. Sin complicaciones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center justify-center gap-2"
              >
                Comienza tu Prueba Gratis
                <ArrowRight size={20} />
              </Link>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition"
              >
                Ver Características
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              Sin tarjeta de crédito • Cancela cuando quieras
            </p>
          </div>
          
          {/* Right Column - Stats/Image */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">100%</p>
                <p className="text-gray-600">Personalizable</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">6</p>
                <p className="text-gray-600">Módulos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">24/7</p>
                <p className="text-gray-600">Soporte</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">Q199</p>
                <p className="text-gray-600">Desde /mes</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                ✅ Más de 500 negocios confían en nosotros
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};