import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Trash2, Mail, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import api from '../../../lib/api';

const TeamSettings = () => {
  const { tenant, user: currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setLoadingInvite] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'staff',
  });

  const fetchMembers = async () => {
    try {
      const response = await api.get(`/tenants/${tenant.slug}/members`);
      setMembers(response.data.members);
    } catch (err) {
      setError('Error al cargar la lista de miembros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenant?.slug) fetchMembers();
  }, [tenant?.slug]);

  const handleInviteChange = (e) => {
    setInviteForm({ ...inviteForm, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setLoadingInvite(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post(`/tenants/${tenant.slug}/invite`, inviteForm);
      setSuccess(response.data.message);
      setInviteForm({ email: '', role: 'staff' });
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al invitar al usuario');
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/tenants/${tenant.slug}/members/${userId}`, { role: newRole });
      setSuccess('Rol actualizado correctamente');
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar el rol');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar a este miembro del equipo?')) return;

    try {
      await api.delete(`/tenants/${tenant.slug}/members/${userId}`);
      setSuccess('Miembro eliminado correctamente');
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar al miembro');
    }
  };

  const getRoleBadge = (role) => {
    const roles = {
      owner: { label: 'Dueño', class: 'bg-primary/20 text-primary border-primary/30' },
      admin: { label: 'Administrador', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
      manager: { label: 'Gerente', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      staff: { label: 'Empleado', class: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
    };
    const r = roles[role] || roles.staff;
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${r.class}`}>{r.label}</span>;
  };

  const isOwner = members.find(m => m.userId?._id === currentUser.id)?.role === 'owner';

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-primary" /> Gestión de Equipo
          </h2>
          <p className="text-slate-400 text-sm">Administra quién tiene acceso a tu panel de control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Miembros */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-500">Cargando equipo...</td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No hay miembros en el equipo</td>
                    </tr>
                  ) : members.map((member) => (
                    <tr key={member._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10">
                            <span className="text-white font-bold">{member.userId?.fullName?.charAt(0) || 'U'}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{member.userId?.fullName} {member.userId?._id === currentUser.id && '(Tú)'}</p>
                            <p className="text-slate-500 text-xs flex items-center gap-1"><Mail size={10} /> {member.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isOwner && member.role !== 'owner' ? (
                          <select
                            value={member.role}
                            onChange={(e) => handleUpdateRole(member.userId._id, e.target.value)}
                            className="bg-dark-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="admin">Administrador</option>
                            <option value="manager">Gerente</option>
                            <option value="staff">Empleado</option>
                          </select>
                        ) : (
                          getRoleBadge(member.role)
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isOwner && member.role !== 'owner' && (
                          <button
                            onClick={() => handleRemoveMember(member.userId._id)}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Eliminar del equipo"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Formulario de Invitación */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-white/5 space-y-6">
            <div className="flex items-center gap-3 text-white font-bold">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <UserPlus size={18} className="text-primary" />
              </div>
              Invitar Miembro
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              El usuario debe tener una cuenta registrada en ModularBusiness para poder ser invitado a tu equipo.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2"><XCircle size={14} /> {error}</div>}
              {success && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2"><CheckCircle2 size={14} /> {success}</div>}

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email del Usuario</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={inviteForm.email}
                    onChange={handleInviteChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="ejemplo@correo.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Asignar Rol</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    name="role"
                    value={inviteForm.role}
                    onChange={handleInviteChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-800/50 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option value="staff">Empleado (Lectura/Escritura básica)</option>
                    <option value="manager">Gerente (Gestión de módulos)</option>
                    <option value="admin">Administrador (Control total menos equipo)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={inviting || !inviteForm.email}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-bold text-sm hover:glow-effect transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {inviting ? 'Invitando...' : 'Enviar Invitación'}
              </button>
            </form>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-4">Acerca de los roles</h3>
            <ul className="space-y-3 text-xs">
              <li className="text-slate-400"><strong className="text-primary uppercase tracking-tighter">Dueño:</strong> Acceso total y control de facturación y equipo.</li>
              <li className="text-slate-400"><strong className="text-emerald-400 uppercase tracking-tighter">Admin:</strong> Control total de la tienda y módulos.</li>
              <li className="text-slate-400"><strong className="text-blue-400 uppercase tracking-tighter">Gerente:</strong> Gestión operativa de módulos activos.</li>
              <li className="text-slate-400"><strong className="text-slate-400 uppercase tracking-tighter">Empleado:</strong> Operación básica diaria del sistema.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSettings;