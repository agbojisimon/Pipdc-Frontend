import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { ImageUpload } from '../ui/ImageUpload';
import { useCreateDevelopmentProject, useUpdateDevelopmentProject } from '../../hooks/mutations';
import { useToast } from '../ui/Toast';
import { extractApiError } from '../../services/api';
import { DEVELOPMENT_PROJECT_STATUS_OPTIONS, developmentStatusLabel } from '../../utils/developmentStatus';
import type { DevelopmentProject } from '../../types/development';
import type { UploadResult } from '../../services/imageService';

const toOptionalNumber = (value: unknown) => (value === '' || value === null || value === undefined ? undefined : Number(value));

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  slug: z.string().optional(),
  location: z.string().min(3, 'Location is required'),
  developer: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  expectedCompletionDate: z.string().optional(),
  progressPercentage: z.number({ message: 'Enter a valid number' }).min(0).max(100).optional(),
  featured: z.boolean(),
});

type DevelopmentProjectFormValues = z.infer<typeof schema>;

interface DevelopmentProjectFormProps {
  open: boolean;
  project: DevelopmentProject | null;
  onClose: () => void;
}

export function DevelopmentProjectForm({ open, project, onClose }: DevelopmentProjectFormProps) {
  const { notify } = useToast();
  const createProject = useCreateDevelopmentProject();
  const updateProject = useUpdateDevelopmentProject();
  const isEditing = Boolean(project);
  const [images, setImages] = useState<UploadResult[]>([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<DevelopmentProjectFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) {
      setImages([]);
      return;
    }
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        slug: project.slug ?? '',
        location: project.location,
        developer: project.developer ?? '',
        status: project.status,
        expectedCompletionDate: project.expectedCompletionDate
          ? project.expectedCompletionDate.split('T')[0]
          : '',
        progressPercentage: project.progressPercentage,
        featured: project.featured,
      });
      setImages((project.images ?? []).map((img) => ({ url: img.url, publicId: img.publicId })));
    } else {
      reset({
        name: '',
        description: '',
        slug: '',
        location: '',
        developer: '',
        status: 'Planning',
        expectedCompletionDate: '',
        progressPercentage: 0,
        featured: false,
      });
      setImages([]);
    }
  }, [open, project, reset]);

  const onSubmit = async (data: DevelopmentProjectFormValues) => {
    const payload: Record<string, unknown> = {
      name: data.name,
      description: data.description,
      slug: data.slug?.trim() || undefined,
      location: data.location,
      developer: data.developer?.trim() || undefined,
      status: data.status,
      expectedCompletionDate: data.expectedCompletionDate || undefined,
      progressPercentage: data.progressPercentage,
      images: images.map((img, i) => ({
        url: img.url,
        publicId: img.publicId,
        isCover: i === 0,
        displayOrder: i,
      })),
      featured: data.featured,
    };

    try {
      if (isEditing && project) {
        await updateProject.mutateAsync({ id: project.id, payload });
        notify({ type: 'success', title: 'Project updated', description: `"${data.name}" was updated.` });
      } else {
        await createProject.mutateAsync(payload);
        notify({ type: 'success', title: 'Project created', description: `"${data.name}" was created.` });
      }
      onClose();
    } catch (err) {
      notify({ type: 'error', title: 'Could not save project', description: extractApiError(err) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Add Project'}
      description={isEditing ? 'Update the project details below.' : 'Fill in the project details to create a new development project.'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Project Name" placeholder="e.g. Rayfield Heights" error={errors.name?.message} {...register('name')} />
        <Textarea label="Description" placeholder="Describe the development project." className="min-h-[100px]" error={errors.description?.message} {...register('description')} />

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Input label="Location" placeholder="e.g. Rayfield, Jos" error={errors.location?.message} {...register('location')} />
          <Input label="Developer" placeholder="e.g. PIPDC" error={errors.developer?.message} {...register('developer')} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Select label="Status" error={errors.status?.message} {...register('status')}>
            {DEVELOPMENT_PROJECT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{developmentStatusLabel(s)}</option>
            ))}
          </Select>
          <Input label="Expected Completion" type="date" error={errors.expectedCompletionDate?.message} {...register('expectedCompletionDate')} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Input label="Progress %" type="number" min={0} max={100} placeholder="0" error={errors.progressPercentage?.message} {...register('progressPercentage', { setValueAs: toOptionalNumber })} />
          <Input label="Slug (optional)" placeholder="Auto-generated from name if blank" error={errors.slug?.message} {...register('slug')} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Project Images</label>
          <ImageUpload folder="development" value={images} onChange={setImages} maxFiles={10} />
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" className="h-4 w-4 rounded border-ink-300 text-forest-500 focus:ring-forest-500" {...register('featured')} />
          Featured on home page
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>{isEditing ? 'Save changes' : 'Create project'}</Button>
        </div>
      </form>
    </Modal>
  );
}
