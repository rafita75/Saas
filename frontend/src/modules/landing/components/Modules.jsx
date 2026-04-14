import { ShoppingBag, Package, Store, Calendar, Calculator, Users } from 'lucide-react';

const modules = [
  {
    icon: <ShoppingBag size={32} />,
    name: 'Tienda en Línea',
    description: 'Vende productos online con carrito de compras, reseñas y cupones.',
    price: 'Desde Q199/mes',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: <Package size={32} />,
    name: 'Inventario',
    description: 'Control de stock, entradas/salidas y alertas de inventario bajo.',
    price: 'Desde Q99/mes',
    color: 'bg-green-50 text-green-600'
  },
  {
    icon: <Store size={32} />,
    name: 'Punto de Venta',
    description: 'Vende en tienda física con lector de código de barras.',
    price: 'Desde Q149/mes',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: <Calendar size={32} />,
    name: 'Reservas y Servicios',
    description: 'Agenda citas, vende servicios y envía recordatorios automáticos.',
    price: 'Desde Q149/mes',
    color: 'bg-orange-50 text-orange-600'
  },
  {
    icon: <Calculator size={32} />,
    name: 'Contabilidad',
    description: 'Control de ingresos, gastos y facturación electrónica FEL.',
    price: 'Desde Q199/mes',
    color: 'bg-red-50 text-red-600'
  },
  {
    icon: <Users size={32} />,
    name: 'Empleados',
    description: 'Gestión de personal, roles, permisos y horarios.',
    price: 'Desde Q79/mes',
    color: 'bg-indigo-50 text-indigo-600'
  }
];

export const Modules = () => {
  return (
    <section id="modules" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Módulos para cada necesidad
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Elige los módulos que tu negocio necesita y actívalos con un clic.
            Puedes agregar o quitar módulos en cualquier momento.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
              <div className={`w-14 h-14 ${module.color} rounded-lg flex items-center justify-center mb-4`}>
                {module.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {module.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {module.description}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {module.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};