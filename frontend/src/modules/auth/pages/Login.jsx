import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../lib/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tenant_slug', response.data.tenant.slug);
      localStorage.setItem('tenant_name', response.data.tenant.name);
      localStorage.setItem('user_email', email);
      
      const slug = response.data.tenant.slug;
      window.location.href = `https://admin.jgsystemsgt.com/${slug}/dashboard`;
      
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Link to="/" className="block text-center mb-8">
          <span className="text-3xl font-bold text-white">ModularBusiness</span>
        </Link>

        <div className="bg-dark-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Iniciar sesión
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;