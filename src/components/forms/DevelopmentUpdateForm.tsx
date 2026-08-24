import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { ImageUpload } from '../ui/ImageUpload';
import { useCreateDevelopmentUpdate, useUpdateDevelopmentUpdate } from '../../hooks/mutations';
import { useToast } from '../ui/Toast';
import { extractApiError } from '../../services/api';
import type { DevelopmentUpdate } from '../../types/development';
import type { UploadResult } from '../../services/imageService';

const optionalNumber = z.number({ message: 'Enter a valid number' }).min(0).max(100).optional();

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(4000),
  progressPercentage: optionalNumber,
  updateDate: z.string().optional(),
});

type UpdateFormValues = z.infer<typeof schema>;

const toOptionalNumber = (value: unknown) => (value === '' || value === null || value === undefined ? undefined : Number(value));

interface DevelopmentUpdateFormProps {
  open: boolean;
  projectId: number;
  update: DevelopmentUpdate | null;
  onClose: () => void;
}

export function DevelopmentUpdateForm({ open, projectId, update, onClose }: DevelopmentUpdateFormProps) {
  const { notify } = useToast();
  const createUpdate = useCreateDevelopmentUpdate();
  const updateUpdate = useUpdateDevelopmentUpdate();
  const isEditing = Boolean(update);
  const [images, setImages] = useState<UploadResult[]>([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) {
      setImages([]);
      return;
    }
    if (update) {
      reset({
        title: update.title,
        description: update.description,
        progressPercentage: update.progressPercentage ?? undefined,
        updateDate: update.updateDate ? update.updateDate.split('T')[0] : '',
      });
      const urls = update.imageUrls ?? [];
      const publicIds = update.imagePublicIds ?? [];
      setImages(urls.map((url, i) => ({ url, publicId: publicIds[i] ?? `existing-${i}` })));
    } else {
      reset({
        title: '',
        description: '',
        progressPercentage: undefined,
        updateDate: new Date().toISOString().split('T')[0],
      });
      setImages([]);
    }
  }, [open, update, reset]);

  const onSubmit = async (data: UpdateFormValues) => {
    const payload: Record<string, unknown> = {
      title: data.title,
      description: data.description,
      progressPercentage: data.progressPercentage,
      updateDate: data.updateDate || undefined,
      imageUrls: images.map((img) => img.url),
      imagePublicIds: images.map((img) => img.publicId),
    };

    try {
      if (isEditing && update) {
        await updateUpdate.mutateAsync({ projectId, updateId: update.id, payload });
        notify({ type: 'success', title: 'Update edited', description: `"${data.title}" was updated.` });
      } else {
        await createUpdate.mutateAsync({ projectId, payload });
        notify({ type: 'success', title: 'Update posted', description: `"${data.title}" was posted.` });
      }
      onClose();
    } catch (err) {
      notify({ type: 'error', title: 'Could not save update', description: extractApiError(err) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Update' : 'Post Update'}
      description={isEditing ? 'Update the project update below.' : 'Share a progress update for this project.'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Title" placeholder="e.g. Foundation Completed" error={errors.title?.message} {...register('title')} />
        <Textarea label="Description" placeholder="Describe the progress update." className="min-h-[100px]" error={errors.description?.message} {...register('description')} />

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Input label="Progress %" type="number" min={0} max={100} placeholder="e.g. 45" error={errors.progressPercentage?.message} {...register('progressPercentage', { setValueAs: toOptionalNumber })} />
          <Input label="Update Date" type="date" error={errors.updateDate?.message} {...register('updateDate')} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Update Images</label>
          <ImageUpload folder="development-updates" value={images} onChange={setImages} maxFiles={10} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>{isEditing ? 'Save changes' : 'Post update'}</Button>
        </div>
      </form>
    </Modal>
  );
}
