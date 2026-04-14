import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { Mail, User, Sparkles, ArrowRight, Check, Rocket } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { PasswordInput } from '../../../shared/components/PasswordInput';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres'),
});

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          // ✅ CAMBIO: Usar dominio real
          emailRedirectTo: `https://jgsystemsgt.com/login`,
        },
      });

      if (error) throw error;

      setRegisteredEmail(data.email);
      setSuccess(true);
    } catch (err) {
      if (err.message.includes('already registered')) {
        setError('Este email ya está registrado. Por favor, inicia sesión.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        
        <div className="max-w-md w-full relative z-10">
          <div className="glass rounded-2xl p-8 border border-primary/20 text-center animate-scale-up">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-400 animate-bounce" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 animate-fade-in-up">
              ¡Revisa tu correo!
            </h2>
            
            <p className="text-slate-400 mb-6 animate-fade-in-up animation-delay-100">
              Hemos enviado un enlace de verificación a{' '}
              <strong className="text-white">{registeredEmail}</strong>
            </p>
            
            <p className="text-sm text-slate-500 mb-6 animate-fade-in-up animation-delay-200">
              Confirma tu cuenta para activar tu período de prueba de 3 días.
            </p>
            
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:glow-effect transition-all duration-300 animate-fade-in-up animation-delay-300"
            >
              Ir a Iniciar Sesión
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Fondos decorativos animados */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float animation-delay-1000" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse-slow" />
      
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

        {/* Badge de prueba gratis */}
        <div className="flex justify-center mb-4 animate-fade-in-up">
          <span className="glass-light px-4 py-1.5 rounded-full text-xs flex items-center gap-2 border border-primary/30">
            <Rocket size={12} className="text-primary animate-pulse" />
            <span className="text-slate-300">Prueba gratis de 3 días • Sin tarjeta</span>
          </span>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-primary/20 animate-fade-in-up animation-delay-100 hover:border-primary/40 transition-all duration-500">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Crea tu cuenta gratis
          </h2>
          <p className="text-slate-400 text-center mb-6">
            Comienza a construir tu sistema hoy
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="animate-fade-in-up animation-delay-200">
              <Input
                label="Nombre completo"
                icon={User}
                placeholder="Juan Pérez"
                error={errors.fullName?.message}
                {...register('fullName')}
              />
            </div>

            <div className="animate-fade-in-up animation-delay-300">
              <Input
                label="Correo electrónico"
                type="email"
                icon={Mail}
                placeholder="juan@empresa.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            <div className="animate-fade-in-up animation-delay-400">
              <PasswordInput
                label="Contraseña"
                placeholder="Mínimo 8 caracteres"
                error={errors.password?.message}
                {...register('password')}
              />
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
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      Comenzar prueba gratis
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6 animate-fade-in-up animation-delay-600">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-1 bg-dark-900/80 backdrop-blur-sm rounded-full text-xs text-slate-400 border border-slate-700/30">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Login CTA */}
          <div className="animate-fade-in-up animation-delay-700">
            <Link
              to="/login"
              className="group block w-full text-center py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-dark-800/50 hover:border-slate-600 transition-all duration-300"
            >
              <span className="group-hover:text-primary transition-colors">Iniciar sesión</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6 animate-fade-in-up animation-delay-800">
          Al registrarte aceptas nuestros{' '}
          <Link to="/terms" className="text-primary hover:underline hover:text-secondary transition-colors">Términos</Link>
          {' '}y{' '}
          <Link to="/privacy" className="text-primary hover:underline hover:text-secondary transition-colors">Privacidad</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;