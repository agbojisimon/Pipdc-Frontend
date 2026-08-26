import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { useUpdateProfile, useChangePassword } from '../../../hooks/mutations';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../ui/Toast';
import { extractApiError } from '../../../services/api';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof schema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SettingsSection() {
  const { user, setUser } = useAuth();
  const { notify } = useToast();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
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

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword();
      setShowPasswordForm(false);
      notify({ type: 'success', title: 'Password changed', description: 'Your password has been updated.' });
    } catch (err) {
      notify({ type: 'error', title: 'Could not change password', description: extractApiError(err) });
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
          <div className="border-t border-ink-100 pt-4">
            {showPasswordForm ? (
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} noValidate className="space-y-3">
                <Input label="Current password" type="password" error={passwordErrors.currentPassword?.message} {...registerPassword('currentPassword')} />
                <Input label="New password" type="password" error={passwordErrors.newPassword?.message} {...registerPassword('newPassword')} />
                <Input label="Confirm new password" type="password" error={passwordErrors.confirmPassword?.message} {...registerPassword('confirmPassword')} />
                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="ghost" onClick={() => { setShowPasswordForm(false); resetPassword(); }}>Cancel</Button>
                  <Button type="submit" variant="primary" loading={isPasswordSubmitting}>Update password</Button>
                </div>
              </form>
            ) : (
              <Button type="button" variant="outline" onClick={() => setShowPasswordForm(true)}>Change password</Button>
            )}
          </div>
          <p className="rounded-xl bg-ink-50 p-3 text-xs text-ink-500">
            Roles and permissions are managed by administrators. You cannot change your own roles.
          </p>
        </div>
      </Card>
    </div>
  );
}
