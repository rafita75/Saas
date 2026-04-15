import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../lib/api';
import { setCookie } from '../../../lib/cookies';
import { Mail, Sparkles, ArrowRight, LogIn, Lock } from 'lucide-react';

// Input simple
const Input = ({ label, type = 'text', icon: Icon, placeholder, error, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />}
      <input
        type={type}
        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-dark-800/50 border ${error ? 'border-red-500/50' : 'border-slate-700'} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50`}
        placeholder={placeholder}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
  </div>
);

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', data);
      
      const { token, tenant } = response.data;
      
      setCookie('token', token, 7);
      setCookie('tenant_slug', tenant.slug, 7);
      setCookie('tenant_name', tenant.name, 7);
      setCookie('user_email', data.email, 7);
      
      localStorage.setItem('token', token);
      localStorage.setItem('tenant_slug', tenant.slug);
      localStorage.setItem('tenant_name', tenant.name);
      localStorage.setItem('user_email', data.email);
      
      window.location.href = `https://admin.jgsystemsgt.com/${tenant.slug}/dashboard`;
      
    } catch (err) {
      setError(err.response?.data?.error || 'Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float animation-delay-1000" />
      <div className="absolute top-1/4 right-1/3 w-56 h-56 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      
      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
            <Sparkles className="relative w-8 h-8 text-primary group-hover:animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-gradient">
              ModularBusiness
            </span>
            <span className="text-xs text-slate-400 -mt-1 text-center">
              by J&H Systems
            </span>
          </div>
        </Link>

        <div className="flex justify-center mb-4">
          <span className="glass-light px-4 py-1.5 rounded-full text-xs flex items-center gap-2 border border-primary/30">
            <LogIn size={12} className="text-primary" />
            <span className="text-slate-300">¡Qué gusto verte de nuevo!</span>
          </span>
        </div>

        <div className="glass rounded-2xl p-8 border border-primary/20">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Bienvenido de vuelta
          </h2>
          <p className="text-slate-400 text-center mb-6">
            Ingresa a tu cuenta para continuar
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:text-secondary">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium hover:glow-effect transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              
              <span className="relative flex items-center gap-2">
                {loading ? 'Iniciando...' : (
                  <>
                    Iniciar sesión
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-1 bg-dark-900/80 backdrop-blur-sm rounded-full text-xs text-slate-400 border border-slate-700/30">
                ¿Nuevo en ModularBusiness?
              </span>
            </div>
          </div>

          <Link
            to="/register"
            className="group block w-full text-center py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-dark-800/50 hover:border-slate-600 transition-all duration-300"
          >
            <span className="group-hover:text-primary transition-colors">Crear una cuenta gratis</span>
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Al ingresar aceptas nuestros{' '}
          <Link to="/terms" className="text-primary hover:underline">Términos</Link>
          {' '}y{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacidad</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;