import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../../lib/api';
import { Mail, User, Sparkles, ArrowRight, Check, Rocket, Building2, Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { getCookie } from '../../../lib/cookies';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  businessName: z.string().min(3, 'Nombre del negocio debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', data);
      
      // Guardar token y datos
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tenant_slug', response.data.tenant.slug);
      localStorage.setItem('tenant_name', response.data.tenant.name);
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass rounded-2xl p-8 text-center">
          <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">¡Cuenta creada!</h2>
          <p className="text-slate-400 mb-6">Tu negocio está listo para empezar.</p>
          <Link to="https://admin.jgsystemsgt.com/login" className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg">
            Ir al panel de administración
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const token = getCookie('token') || localStorage.getItem('token');
    const slug = getCookie('tenant_slug') || localStorage.getItem('tenant_slug');
    
    if (token && slug) {
      window.location.href = `https://admin.jgsystemsgt.com/${slug}/dashboard`;
    }
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-primary" />
          <span className="text-3xl font-bold text-gradient">ModularBusiness</span>
        </Link>

        <div className="glass rounded-2xl p-8 border border-primary/20">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Crea tu cuenta</h2>
          <p className="text-slate-400 text-center mb-6">Prueba gratis de 3 días</p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nombre completo"
              icon={User}
              placeholder="Juan Pérez"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

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

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="w-full pl-10 pr-10 py-3 bg-dark-800/50 border border-slate-700 rounded-xl text-white"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium"
            >
              {loading ? 'Creando cuenta...' : 'Comenzar prueba gratis'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-dark-900 text-slate-400 text-sm">¿Ya tienes cuenta?</span>
            </div>
          </div>

          <Link to="/login" className="block w-full text-center py-3 border border-slate-700 rounded-xl text-white">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;