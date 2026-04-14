import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../../lib/supabase';
import { Mail, User, Sparkles, ArrowRight, Check, Rocket, Building2, Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { PasswordInput } from '../../../shared/components/PasswordInput';

// ✅ Esquema de validación mejorado
const registerSchema = z.object({
  fullName: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  businessName: z.string()
    .min(3, 'Nombre del negocio debe tener al menos 3 caracteres')
    .regex(/^[a-zA-Z0-9\s\-&]+$/, 'Solo letras, números, espacios, guiones y &'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^A-Za-z0-9]/, 'Debe contener al menos un símbolo'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  // ✅ Calcular fortaleza de contraseña
  const calculateStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.match(/[A-Z]/)) strength++;
    if (pwd.match(/[0-9]/)) strength++;
    if (pwd.match(/[^A-Za-z0-9]/)) strength++;
    return strength;
  };

  // ✅ Generar slug desde nombre del negocio
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const slug = generateSlug(data.businessName);
      
      // ✅ Verificar si el slug ya existe
      const { data: existingTenant } = await supabase
        .from('tenants')
        .select('slug')
        .eq('slug', slug)
        .single();

      if (existingTenant) {
        setError('Este nombre de negocio ya está registrado. Prueba con otro.');
        setLoading(false);
        return;
      }

      // ✅ Registrar usuario en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            business_name: data.businessName,
            tenant_slug: slug,
          },
          emailRedirectTo: `https://jgsystemsgt.com/login`,
        },
      });

      if (authError) throw authError;

      // ✅ Crear tenant manualmente para asegurar el slug correcto
      const { error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: data.businessName,
          slug: slug,
          owner_id: authData.user.id,
          subscription_status: 'trial',
          trial_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (tenantError) throw tenantError;

      // ✅ Crear relación tenant_user
      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', slug)
        .single();

      await supabase
        .from('tenant_users')
        .insert({
          tenant_id: tenant.id,
          user_id: authData.user.id,
          role: 'owner',
        });

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
            <h2 className="text-2xl font-bold text-white mb-2">¡Revisa tu correo!</h2>
            <p className="text-slate-400 mb-6">
              Hemos enviado un enlace de verificación a <strong className="text-white">{registeredEmail}</strong>
            </p>
            <Link to="/login" className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-medium hover:glow-effect transition">
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float animation-delay-1000" />
      
      <div className="max-w-md w-full relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300" />
            <Sparkles className="relative w-8 h-8 text-primary group-hover:animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-gradient">ModularBusiness</span>
            <span className="text-xs text-slate-400 -mt-1 text-center">by J&H Systems</span>
          </div>
        </Link>

        <div className="flex justify-center mb-4 animate-fade-in-up">
          <span className="glass-light px-4 py-1.5 rounded-full text-xs flex items-center gap-2 border border-primary/30">
            <Rocket size={12} className="text-primary animate-pulse" />
            <span className="text-slate-300">Prueba gratis de 3 días • Sin tarjeta</span>
          </span>
        </div>

        <div className="glass rounded-2xl p-8 border border-primary/20 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Crea tu cuenta gratis</h2>
          <p className="text-slate-400 text-center mb-6">Comienza a construir tu sistema hoy</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Nombre completo"
              icon={User}
              placeholder="Juan Pérez"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            {/* ✅ NUEVO: Campo nombre del negocio */}
            <Input
              label="Nombre de tu negocio"
              icon={Building2}
              placeholder="Mi Negocio GT"
              error={errors.businessName?.message}
              {...register('businessName')}
            />

            <Input
              label="Correo electrónico"
              type="email"
              icon={Mail}
              placeholder="juan@empresa.com"
              error={errors.email?.message}
              {...register('email')}
            />

            {/* ✅ Contraseña con indicador de fortaleza */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  onChange={(e) => {
                    register('password').onChange(e);
                    setPasswordStrength(calculateStrength(e.target.value));
                  }}
                  className="w-full pl-10 pr-10 py-3 bg-dark-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* ✅ Indicador de fortaleza */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${
                          passwordStrength >= level
                            ? level <= 2 ? 'bg-red-500' : level === 3 ? 'bg-yellow-500' : 'bg-green-500'
                            : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {passwordStrength <= 2 && 'Débil - Agrega mayúsculas, números y símbolos'}
                    {passwordStrength === 3 && 'Media - ¡Casi llegas!'}
                    {passwordStrength === 4 && '✅ Fuerte - ¡Excelente!'}
                  </p>
                </div>
              )}
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            {/* ✅ Confirmar contraseña */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className="w-full pl-10 pr-10 py-3 bg-dark-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="group relative w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium hover:glow-effect transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                {loading ? 'Creando cuenta...' : (
                  <>Comenzar prueba gratis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-1 bg-dark-900/80 backdrop-blur-sm rounded-full text-xs text-slate-400 border border-slate-700/30">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <Link to="/login" className="group block w-full text-center py-3 rounded-xl border border-slate-700 text-white font-medium hover:bg-dark-800/50 hover:border-slate-600 transition">
            Iniciar sesión
          </Link>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Al registrarte aceptas nuestros{' '}
          <Link to="/terms" className="text-primary hover:underline">Términos</Link> y{' '}
          <Link to="/privacy" className="text-primary hover:underline">Privacidad</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;