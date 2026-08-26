import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { ImageUpload } from '../ui/ImageUpload';
import { useCreateBlogPost, useUpdateBlogPost, useCreateCategory, useCreateTag } from '../../hooks/mutations';
import { useBlogCategories, useBlogTags } from '../../hooks/queries';
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
  keyQuote: z.string().optional(),
  categoryId: z.string().optional(),
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
  const { data: categories = [] } = useBlogCategories();
  const { data: tags = [] } = useBlogTags();
  const isEditing = Boolean(post);
  const [coverImage, setCoverImage] = useState<UploadResult[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const createCategory = useCreateCategory();
  const [newTagName, setNewTagName] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const createTag = useCreateTag();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BlogFormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) {
      setCoverImage([]);
      setSelectedTagIds([]);
      setNewCategoryName('');
      setShowCategoryInput(false);
      setNewTagName('');
      setShowTagInput(false);
      return;
    }
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? '',
        status: post.status as BlogFormValues['status'],
        content: post.content,
        keyQuote: post.keyQuote ?? '',
        categoryId: post.categoryId?.toString() ?? '',
      });
      setSelectedTagIds(post.tags.map((t) => t.id));
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
        keyQuote: '',
        categoryId: '',
      });
      setSelectedTagIds([]);
      setCoverImage([]);
    }
  }, [open, post, reset]);

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    try {
      const result = await createCategory.mutateAsync({ name });
      reset((prev) => ({ ...prev, categoryId: result?.id?.toString() ?? '' }));
      setNewCategoryName('');
      setShowCategoryInput(false);
      notify({ type: 'success', title: 'Category created', description: `"${name}" was created.` });
    } catch (err) {
      notify({ type: 'error', title: 'Could not create category', description: extractApiError(err) });
    }
  };

  const handleCreateTag = async () => {
    const name = newTagName.trim();
    if (!name) return;
    try {
      const result = await createTag.mutateAsync({ name });
      if (result?.id) setSelectedTagIds((prev) => [...prev, result.id]);
      setNewTagName('');
      setShowTagInput(false);
      notify({ type: 'success', title: 'Tag created', description: `"${name}" was created.` });
    } catch (err) {
      notify({ type: 'error', title: 'Could not create tag', description: extractApiError(err) });
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    const payload: Record<string, unknown> = {
      title: data.title,
      slug: data.slug?.trim() || undefined,
      excerpt: data.excerpt?.trim() || undefined,
      coverImageUrl: coverImage[0]?.url || undefined,
      coverImagePublicId: coverImage[0]?.publicId || undefined,
      status: data.status,
      content: data.content,
      keyQuote: data.keyQuote?.trim() || undefined,
      categoryId: data.categoryId ? Number(data.categoryId) : null,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
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
          <div className="space-y-4">
            <Select label="Status" error={errors.status?.message} {...register('status')}>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
            <Select label="Category" error={errors.categoryId?.message} {...register('categoryId')}>
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            {!showCategoryInput ? (
              <button type="button" onClick={() => setShowCategoryInput(true)} className="text-xs font-medium text-forest-600 hover:text-forest-700 transition-colors">
                + Create new category
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="flex-1 rounded-lg border border-ink-200 px-3 py-1.5 text-sm focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateCategory(); } }}
                />
                <Button type="button" variant="primary" size="sm" onClick={handleCreateCategory} loading={createCategory.isPending}>Save</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowCategoryInput(false); setNewCategoryName(''); }}>Cancel</Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Excerpt" placeholder="Short summary shown on cards" error={errors.excerpt?.message} {...register('excerpt')} />
          <Input label="Slug (optional)" placeholder="Auto-generated from title if blank" error={errors.slug?.message} {...register('slug')} />
        </div>

        <Input label="Key Quote (optional)" placeholder="e.g. A good name is more desirable than great riches" error={errors.keyQuote?.message} {...register('keyQuote')} />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selectedTagIds.includes(tag.id)
                    ? 'border-forest-500 bg-forest-50 text-forest-700'
                    : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
            {!showTagInput ? (
              <button type="button" onClick={() => setShowTagInput(true)} className="rounded-full border border-dashed border-ink-300 px-3 py-1 text-xs font-medium text-ink-500 hover:border-forest-400 hover:text-forest-600 transition-colors">
                + New tag
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name"
                  className="rounded-full border border-ink-200 px-3 py-1 text-xs focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreateTag(); } }}
                />
                <Button type="button" variant="primary" size="sm" onClick={handleCreateTag} loading={createTag.isPending}>Save</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowTagInput(false); setNewTagName(''); }}>Cancel</Button>
              </div>
            )}
          </div>
        </div>

        <Textarea
          label="Content"
          placeholder="Write the full article here. Markdown is supported."
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
