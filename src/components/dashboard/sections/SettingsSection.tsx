import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { useUpdateProfile } from '../../../hooks/mutations';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../ui/Toast';
import { extractApiError } from '../../../services/api';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof schema>;

export function SettingsSection() {
  const { user, setUser } = useAuth();
  const { notify } = useToast();
  const updateProfile = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!user) return;
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber ?? '',
    });
  }, [user, reset]);

  if (!user) return null;

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const updated = await updateProfile.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber?.trim() || undefined,
      });
      setUser(updated);
      notify({ type: 'success', title: 'Profile updated', description: 'Your profile information was saved.' });
    } catch (err) {
      notify({ type: 'error', title: 'Could not update profile', description: extractApiError(err) });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 p-4 sm:p-6">
          <Input label="Email" value={user.email} disabled hint="Email address cannot be changed." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="First name" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last name" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Phone number" placeholder="e.g. +234 800 000 0000" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" loading={isSubmitting}>Save changes</Button>
          </div>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <div className="space-y-4 p-4 text-sm sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Signed in as</p>
            <p className="mt-1 font-medium text-ink-900">{user.fullName}</p>
            <p className="text-ink-500">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Roles</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {user.roles.map((r) => (
                <Badge key={r} tone={r === 'Admin' ? 'forest' : r === 'Agent' ? 'gold' : 'neutral'}>{r}</Badge>
              ))}
            </div>
          </div>
          <p className="rounded-xl bg-ink-50 p-3 text-xs text-ink-500">
            Roles and permissions are managed by administrators. You cannot change your own roles.
          </p>
        </div>
      </Card>
    </div>
  );
}
