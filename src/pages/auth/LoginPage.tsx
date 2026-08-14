import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/ui/Toast';
import { authService } from '../../services/authService';
import { extractApiError } from '../../services/api';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { notify } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { remember: true },
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      const auth = await authService.login({ email: data.email, password: data.password });
      await signIn(auth);
      notify({ type: 'success', title: 'Welcome back', description: 'You have signed in successfully.' });
      const from = (location.state as { from?: string } | null)?.from;
      const destination = from ?? (auth.roles.includes('Admin') ? '/dashboard' : '/');
      navigate(destination, { replace: true });
    } catch (err) {
      setServerError(extractApiError(err));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">Sign in to PIPDC</h1>
        <p className="mt-2 text-sm text-ink-500">Welcome back. Enter your details to continue.</p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="text-ink-400 hover:text-ink-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register('password')}
        />
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-ink-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-ink-300 text-forest-500 focus:ring-forest-500"
              {...register('remember')}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-forest-600 hover:text-forest-700">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
          Sign in
        </Button>
      </form>

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-ink-100 bg-ink-50 p-3 text-xs text-ink-500">
        <ShieldCheck className="h-4 w-4 text-forest-500" />
        Your session is protected with bank-grade encryption.
      </div>

      <p className="mt-8 text-center text-sm text-ink-500">
        Don&rsquo;t have an account?{' '}
        <Link to="/register" className="font-semibold text-forest-600 hover:text-forest-700">
          Create one
        </Link>
      </p>
    </div>
  );
}
