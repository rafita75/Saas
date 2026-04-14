import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { Mail, Sparkles, ArrowRight, LogIn } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { PasswordInput } from '../../../shared/components/PasswordInput';

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
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Obtener tenant del usuario
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenant_users')
        .select(`
          tenant_id,
          tenants!inner(slug, name)
        `)
        .eq('user_id', authData.user.id)
        .single();

      if (tenantError) {
        console.error('Error obteniendo tenant:', tenantError);
        throw new Error('No se encontró un negocio asociado a tu cuenta.');
      }

      localStorage.setItem('tenant_slug', tenantData.tenants.slug);
      localStorage.setItem('tenant_name', tenantData.tenants.name);
      localStorage.setItem('user_email', authData.user.email);

      // ✅ Redirigir simple al dashboard
      const slug = tenantData.tenants.slug;
      window.location.href = `https://admin.jgsystemsgt.com/${slug}/dashboard`;

    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float animation-delay-1000" />
      <div className="absolute top-1/4 right-1/3 w-56 h-56 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
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

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span className="glass-light px-4 py-1.5 rounded-full text-xs flex items-center gap-2 border border-primary/30">
            <LogIn size={12} className="text-primary" />
            <span className="text-slate-300">¡Qué gusto verte de nuevo!</span>
          </span>
        </div>

        {/* Card */}
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

            <PasswordInput
              label="Contraseña"
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
              className="group relative w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium hover:glow-effect transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
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

          {/* Register CTA */}
          <Link
            to="/register"
            className="block w-full text-center py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-dark-800/50 transition"
          >
            Crear una cuenta gratis
          </Link>
        </div>

        {/* Footer */}
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