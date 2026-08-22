import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { useCreateDevelopmentUnit, useUpdateDevelopmentUnit } from '../../hooks/mutations';
import { useToast } from '../ui/Toast';
import { extractApiError } from '../../services/api';
import { DEVELOPMENT_UNIT_STATUS_OPTIONS, unitStatusLabel } from '../../utils/developmentStatus';
import type { DevelopmentUnit } from '../../types/development';

const schema = z.object({
  unitIdentifier: z.string().min(1, 'Unit identifier is required').max(50),
  unitType: z.string().min(1, 'Unit type is required').max(100),
  status: z.string().min(1, 'Status is required'),
  price: z.number({ message: 'Enter a valid price' }).min(0).optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
});

type UnitFormValues = z.infer<typeof schema>;

const toOptionalNumber = (value: unknown) => (value === '' || value === null || value === undefined ? undefined : Number(value));

interface DevelopmentUnitFormProps {
  open: boolean;
  projectId: number;
  unit: DevelopmentUnit | null;
  onClose: () => void;
}

export function DevelopmentUnitForm({ open, projectId, unit, onClose }: DevelopmentUnitFormProps) {
  const { notify } = useToast();
  const createUnit = useCreateDevelopmentUnit();
  const updateUnit = useUpdateDevelopmentUnit();
  const isEditing = Boolean(unit);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UnitFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) return;
    if (unit) {
      reset({
        unitIdentifier: unit.unitIdentifier,
        unitType: unit.unitType,
        status: unit.status,
        price: unit.price ?? undefined,
        currency: unit.currency ?? 'NGN',
        description: unit.description ?? '',
      });
    } else {
      reset({
        unitIdentifier: '',
        unitType: '',
        status: 'Available',
        price: undefined,
        currency: 'NGN',
        description: '',
      });
    }
  }, [open, unit, reset]);

  const onSubmit = async (data: UnitFormValues) => {
    const payload: Record<string, unknown> = {
      unitIdentifier: data.unitIdentifier,
      unitType: data.unitType,
      status: data.status,
      price: data.price,
      currency: data.currency || 'NGN',
      description: data.description?.trim() || undefined,
    };

    try {
      if (isEditing && unit) {
        await updateUnit.mutateAsync({ projectId, unitId: unit.id, payload });
        notify({ type: 'success', title: 'Unit updated', description: `"${data.unitIdentifier}" was updated.` });
      } else {
        await createUnit.mutateAsync({ projectId, payload });
        notify({ type: 'success', title: 'Unit added', description: `"${data.unitIdentifier}" was added.` });
      }
      onClose();
    } catch (err) {
      notify({ type: 'error', title: 'Could not save unit', description: extractApiError(err) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Unit' : 'Add Unit'}
      description={isEditing ? 'Update the unit details below.' : 'Add a new unit to this project.'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Unit Identifier" placeholder="e.g. Unit 1A, Block B Penthouse" error={errors.unitIdentifier?.message} {...register('unitIdentifier')} />
        <Input label="Unit Type" placeholder="e.g. 2BR Apartment, Commercial Space" error={errors.unitType?.message} {...register('unitType')} />

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            {DEVELOPMENT_UNIT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{unitStatusLabel(s)}</option>
            ))}
          </Select>
          <Select label="Currency" error={errors.currency?.message} {...register('currency')}>
            {['NGN', 'USD', 'EUR', 'GBP'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>

        <Input label="Price" type="number" step="any" placeholder="0" error={errors.price?.message} {...register('price', { setValueAs: toOptionalNumber })} />

        <Textarea label="Description" placeholder="Optional description for this unit." className="min-h-[80px]" error={errors.description?.message} {...register('description')} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>{isEditing ? 'Save changes' : 'Add unit'}</Button>
        </div>
      </form>
    </Modal>
  );
}
