import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { useResetPassword } from '../../hooks/mutations';
import { extractApiError } from '../../services/api';

const schema = z
  .object({
    code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type ResetForm = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { notify } = useToast();
  const email = searchParams.get('email') ?? '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetForm>({
    resolver: zodResolver(schema),
  });
  const resetPassword = useResetPassword();

  const onSubmit = async (data: ResetForm) => {
    setServerError(null);
    try {
      await resetPassword.mutateAsync({ email, code: data.code, newPassword: data.newPassword });
      notify({ type: 'success', title: 'Password changed', description: 'Sign in with your new password.' });
      navigate('/login');
    } catch (err) {
      setServerError(extractApiError(err));
    }
  };

  if (!email) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-ink-900">Reset your password</h1>
          <p className="mt-2 text-sm text-ink-500">
            This link is missing the email it belongs to. Start again from the forgot-password page.
          </p>
        </div>
        <Link to="/forgot-password" className="inline-block">
          <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />}>Request a new code</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">Set a new password</h1>
        <p className="mt-2 text-sm text-ink-500">
          Enter the 6-digit code sent to <span className="font-semibold text-ink-800">{email}</span>,
          then choose a new password.
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Verification code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          leftIcon={<KeyRound className="h-4 w-4" />}
          error={errors.code?.message}
          {...register('code')}
        />
        <Input
          label="New password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.newPassword?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-400 hover:text-ink-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register('newPassword')}
        />
        <Input
          label="Confirm new password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className="flex h-8 w-8 items-center justify-center rounded-md text-ink-400 hover:text-ink-700"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register('confirmPassword')}
        />
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
          Reset password
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-500">
        Didn&rsquo;t get a code?{' '}
        <Link to="/forgot-password" className="font-semibold text-forest-600 hover:text-forest-700">
          Request another
        </Link>
      </p>
    </div>
  );
}