import { useState } from 'react';
import { Building2, Save, Globe, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../../lib/api';
import { setCookie } from '../../../lib/cookies';

const BusinessSettings = () => {
  const { tenant, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    logo: tenant?.logo || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await api.put(`/tenants/${tenant.slug}`, formData);
      
      if (response.data.success) {
        setSuccess(true);
        // Actualizar datos locales y contexto
        const updatedTenant = { ...tenant, ...formData };
        setCookie('tenant', JSON.stringify(updatedTenant));
        localStorage.setItem('tenant', JSON.stringify(updatedTenant));
        await checkAuth(); // Refrescar el contexto global
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Configuración del Negocio</h2>
          <p className="text-slate-400 text-sm">Gestiona la identidad y ajustes básicos de tu empresa</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Cambios guardados correctamente
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Building2 size={16} className="text-primary" />
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ej. Mi Tienda Moderna"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <ImageIcon size={16} className="text-primary" />
                  URL del Logo
                </label>
                <input
                  type="text"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="https://ejemplo.com/mi-logo.png"
                />
                <p className="text-[10px] text-slate-500 italic">Próximamente: Subida directa de archivos</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:glow-effect transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </form>

          {/* Información No Editable */}
          <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Información del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-dark-800/30 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  <Globe size={12} /> Identificador (Slug)
                </p>
                <p className="text-white font-mono text-sm">{tenant?.slug}</p>
              </div>
              <div className="p-4 bg-dark-800/30 rounded-xl border border-white/5">
                <p className="text-xs text-slate-500 mb-1">Dominio Asignado</p>
                <p className="text-white text-sm">{tenant?.slug}.jgsystemsgt.com</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic">
              * El identificador único no puede ser cambiado una vez creado el negocio por motivos de integridad de datos.
            </p>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-white/5 text-center space-y-4">
            <h3 className="text-sm font-semibold text-slate-400">Vista Previa de Marca</h3>
            <div className="w-24 h-24 mx-auto rounded-2xl bg-dark-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {formData.logo ? (
                <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={40} className="text-slate-600" />
              )}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{formData.name || 'Tu Negocio'}</p>
              <p className="text-slate-500 text-xs">{tenant?.slug}.jgsystemsgt.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;