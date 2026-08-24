import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { ImageUpload } from '../ui/ImageUpload';
import { useCreateBlogPost, useUpdateBlogPost } from '../../hooks/mutations';
import { useToast } from '../ui/Toast';
import { extractApiError } from '../../services/api';
import type { BlogPost } from '../../types';
import type { UploadResult } from '../../services/imageService';

const statuses = ['Draft', 'Published', 'Archived'] as const;

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  status: z.enum(statuses),
  content: z.string().min(20, 'Content must be at least 20 characters'),
});

type BlogFormValues = z.infer<typeof schema>;

interface BlogFormProps {
  open: boolean;
  post: BlogPost | null;
  onClose: () => void;
}

export function BlogForm({ open, post, onClose }: BlogFormProps) {
  const { notify } = useToast();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const isEditing = Boolean(post);
  const [coverImage, setCoverImage] = useState<UploadResult[]>([]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BlogFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) {
      setCoverImage(null);
      return;
    }
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        status: post.status as BlogFormValues['status'],
        content: post.content,
      });
      if (post.coverImageUrl) {
        setCoverImage([{ url: post.coverImageUrl, publicId: post.coverImagePublicId ?? '' }]);
      } else {
        setCoverImage([]);
      }
    } else {
      reset({
        title: '',
        slug: '',
        excerpt: '',
        status: 'Draft',
        content: '',
      });
      setCoverImage([]);
    }
  }, [open, post, reset]);

  const onSubmit = async (data: BlogFormValues) => {
    const payload: Record<string, unknown> = {
      title: data.title,
      slug: data.slug?.trim() || undefined,
      excerpt: data.excerpt?.trim() || undefined,
      coverImageUrl: coverImage[0]?.url || undefined,
      coverImagePublicId: coverImage[0]?.publicId || undefined,
      status: data.status,
      content: data.content,
    };

    try {
      if (isEditing && post) {
        await updatePost.mutateAsync({ id: post.id, payload });
        notify({ type: 'success', title: 'Post updated', description: `"${data.title}" was updated.` });
      } else {
        await createPost.mutateAsync(payload);
        notify({ type: 'success', title: 'Post created', description: `"${data.title}" was saved.` });
      }
      onClose();
    } catch (err) {
      notify({ type: 'error', title: 'Could not save post', description: extractApiError(err) });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Post' : 'New Post'}
      description="Write and publish an insight for the PIPDC portal."
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="Title" placeholder="e.g. Buying Your First Home in Abuja" error={errors.title?.message} {...register('title')} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Cover Image</label>
            <ImageUpload folder="blogs" value={coverImage} onChange={setCoverImage} maxFiles={1} />
          </div>
          <div>
            <Select label="Status" error={errors.status?.message} {...register('status')}>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Excerpt" placeholder="Short summary shown on cards" error={errors.excerpt?.message} {...register('excerpt')} />
          <Input label="Slug (optional)" placeholder="Auto-generated from title if blank" error={errors.slug?.message} {...register('slug')} />
        </div>

        <Textarea
          label="Content"
          placeholder="Write the full article here."
          className="min-h-[180px]"
          error={errors.content?.message}
          {...register('content')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>{isEditing ? 'Save changes' : 'Create post'}</Button>
        </div>
      </form>
    </Modal>
  );
}
