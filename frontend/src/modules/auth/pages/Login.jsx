import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../lib/api';
import { Mail, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { Input } from '../../../shared/components/Input';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', data);
      
      // Guardar token y datos
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tenant_slug', response.data.tenant.slug);
      localStorage.setItem('tenant_name', response.data.tenant.name);
      
      // Redirigir al dashboard
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
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-primary" />
          <span className="text-3xl font-bold text-gradient">ModularBusiness</span>
        </Link>

        <div className="glass rounded-2xl p-8 border border-primary/20">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Bienvenido de vuelta</h2>
          <p className="text-slate-400 text-center mb-6">Ingresa a tu cuenta</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Correo electrónico"
              type="email"
              icon={Mail}
              placeholder="juan@empresa.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Contraseña"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium"
            >
              {loading ? 'Iniciando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-dark-900 text-slate-400 text-sm">¿Nuevo en ModularBusiness?</span>
            </div>
          </div>

          <Link to="/register" className="block w-full text-center py-3 border border-slate-700 rounded-xl text-white">
            Crear una cuenta gratis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;