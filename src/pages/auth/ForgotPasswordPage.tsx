import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { ArrowRight, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

type ForgotForm = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const { notify } = useToast();
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (_data: ForgotForm) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setSent(true);
        notify({ type: 'info', title: 'Reset link sent', description: 'Check your inbox for instructions.' });
        resolve();
      }, 700);
    });
  };

  if (sent) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-50 text-forest-600">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink-900">Check your email</h1>
        <p className="mt-3 text-sm text-ink-500">
          We have sent a password reset link to <span className="font-semibold text-ink-800">{getValues('email')}</span>.
          Follow the link to reset your password.
        </p>
        <Link to="/login" className="mt-8 inline-block">
          <Button variant="primary" size="lg" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">Forgot password?</h1>
        <p className="mt-2 text-sm text-ink-500">
          Enter the email associated with your account and we&rsquo;ll send a reset link.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@email.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
          Send reset link
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-ink-500">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-forest-600 hover:text-forest-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}
