import { useState, useRef } from 'react';
import { Building2, Save, Globe, Image as ImageIcon, CheckCircle2, Upload, ExternalLink } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../../lib/api';
import { setCookie } from '../../../lib/cookies';
import { getPublicUrl } from '../../../config/domains';

const BusinessSettings = () => {
  const { tenant, checkAuth } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    publicSlug: tenant?.publicSlug || '',
  });

  const [previewLogo, setPreviewLogo] = useState(tenant?.logo || '');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Crear preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result);
    };
    reader.readAsDataURL(file);

    // Subir a Cloudinary inmediatamente o esperar al save? 
    // Por simplicidad en este paso, lo subimos al guardar todo.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Actualizar Datos Básicos
      await api.put(`/tenants/${tenant.slug}`, { name: formData.name });
      
      // 2. Actualizar Slug Público si cambió
      if (formData.publicSlug !== tenant.publicSlug) {
        await api.put(`/tenants/${tenant.slug}/public-slug`, { publicSlug: formData.publicSlug });
      }

      // 3. Subir Logo si hay un archivo nuevo
      if (fileInputRef.current?.files[0]) {
        const fileData = new FormData();
        fileData.append('logo', fileInputRef.current.files[0]);
        await api.post(`/tenants/${tenant.slug}/logo`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      setSuccess(true);
      await checkAuth(); // Refrescar el contexto global
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
          <p className="text-slate-400 text-sm">Gestiona la identidad y presencia online de tu empresa</p>
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
                  Configuración actualizada con éxito
                </div>
              )}

              {/* Nombre */}
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

              {/* Public Slug */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Globe size={16} className="text-primary" />
                  URL Pública (Slug)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      name="publicSlug"
                      value={formData.publicSlug}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="mi-tienda"
                      required
                    />
                  </div>
                  <a 
                    href={getPublicUrl(formData.publicSlug)} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-dark-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Ver tienda pública"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
                <p className="text-[10px] text-slate-500">Esta es la URL que compartirás con tus clientes.</p>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <ImageIcon size={16} className="text-primary" />
                  Logo del Negocio
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
                >
                  <Upload className="text-slate-500 group-hover:text-primary transition-colors" />
                  <span className="text-sm text-slate-400 group-hover:text-slate-300">Haga clic para subir una imagen</span>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:glow-effect transition-all disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Guardando...' : 'Guardar Configuración'}
                </button>
              </div>
            </div>
          </form>

          {/* Admin Info (Read Only) */}
          <div className="glass rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Identidad Administrativa</h3>
            <div className="p-4 bg-dark-800/30 rounded-xl border border-white/5">
              <p className="text-xs text-slate-500 mb-1">ID de Administración (Inmutable)</p>
              <p className="text-white font-mono text-sm">{tenant?.slug}</p>
              <p className="text-[10px] text-slate-600 mt-2 italic">
                * Este ID se usa para tu panel de control y acceso de empleados. No puede ser cambiado.
              </p>
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-white/5 text-center space-y-4 sticky top-6">
            <h3 className="text-sm font-semibold text-slate-400">Vista Previa de Marca</h3>
            <div className="w-24 h-24 mx-auto rounded-2xl bg-dark-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {previewLogo ? (
                <img src={previewLogo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Building2 size={40} className="text-slate-600" />
              )}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{formData.name || 'Tu Negocio'}</p>
              <p className="text-primary text-xs font-mono">{formData.publicSlug}.jgsystemsgt.com</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Asegúrate de que tu logo sea cuadrado y tenga buena resolución para una mejor visualización.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSettings;