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

      const { data: tenantData, error: tenantError } = await supabase
        .from('tenant_users')
        .select(`
          tenant_id,
          tenants!inner(slug, name, selected_modules, subscription_status)
        `)
        .eq('user_id', authData.user.id)
        .single();

      if (tenantError) throw tenantError;

      localStorage.setItem('tenant_slug', tenantData.tenants.slug);
      localStorage.setItem('tenant_name', tenantData.tenants.name);
      localStorage.setItem('user_email', authData.user.email);

      if (tenantData.tenants.selected_modules) {
        localStorage.setItem('selected_modules', JSON.stringify(tenantData.tenants.selected_modules));
      }

      const hasModules = tenantData.tenants.selected_modules &&
                         tenantData.tenants.selected_modules.length > 0;
      const isTrial = tenantData.tenants.subscription_status === 'trial' ||
                      !tenantData.tenants.subscription_status;

      const slug = tenantData.tenants.slug;
      // ✅ Redirigir SIEMPRE a /dashboard (o /onboarding si no tiene módulos)
      if (!hasModules || isTrial) {
        window.location.href = `https://admin.jgsystemsgt.com/${slug}/onboarding`;
      } else {
        window.location.href = `https://admin.jgsystemsgt.com/${slug}/dashboard`;
      }

    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos'
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondos decorativos animados */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float animation-delay-1000" />
      <div className="absolute top-1/4 right-1/3 w-56 h-56 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />

      <div className="max-w-md w-full relative z-10">
        {/* Logo con animación */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
            <Sparkles className="relative w-8 h-8 text-primary group-hover:animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-gradient animate-fade-in-down">
              ModularBusiness
            </span>
            <span className="text-xs text-slate-400 -mt-1 text-center animate-fade-in-down animation-delay-100">
              by J&H Systems
            </span>
          </div>
        </Link>

        {/* Badge de bienvenida */}
        <div className="flex justify-center mb-4 animate-fade-in-up">
          <span className="glass-light px-4 py-1.5 rounded-full text-xs flex items-center gap-2 border border-primary/30">
            <LogIn size={12} className="text-primary" />
            <span className="text-slate-300">¡Qué gusto verte de nuevo!</span>
          </span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-primary/20 animate-fade-in-up animation-delay-100 hover:border-primary/40 transition-all duration-500">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Bienvenido de vuelta
          </h2>
          <p className="text-slate-400 text-center mb-6">
            Ingresa a tu cuenta para continuar
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="animate-fade-in-up animation-delay-200">
              <Input
                label="Correo electrónico"
                type="email"
                icon={Mail}
                placeholder="juan@empresa.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="animate-fade-in-up animation-delay-300">
              <PasswordInput
                label="Contraseña"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <div className="text-right animate-fade-in-up animation-delay-400">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-secondary transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className="animate-fade-in-up animation-delay-500">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium hover:glow-effect transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Efecto shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            </div>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-dark-900/80 text-slate-400">O continúa con</span>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              setError('');
              
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: 'https://admin.jgsystemsgt.com/dashboard',
                },
              });
              
              if (error) {
                setError(error.message);
                setLoading(false);
              }
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-dark-800/50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="relative my-6 animate-fade-in-up animation-delay-600">
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
          <div className="animate-fade-in-up animation-delay-700">
            <Link
              to="/register"
              className="group block w-full text-center py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-dark-800/50 hover:border-slate-600 transition-all duration-300"
            >
              <span className="group-hover:text-primary transition-colors">Crear una cuenta gratis</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6 animate-fade-in-up animation-delay-800">
          Al ingresar aceptas nuestros{' '}
          <Link to="/terms" className="text-primary hover:underline hover:text-secondary transition-colors">Términos</Link>
          {' '}y{' '}
          <Link to="/privacy" className="text-primary hover:underline hover:text-secondary transition-colors">Privacidad</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;