import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { BlogForm } from '../../forms/BlogForm';
import { useDeleteBlogPost } from '../../../hooks/mutations';
import { useAllBlogPosts } from '../../../hooks/queries';
import { formatDate } from '../../../utils/format';
import { extractApiError } from '../../../services/api';
import { useToast } from '../../ui/Toast';
import { CardTable, RowActions, LoadingRows, TableEmpty, thClass, tdClass } from './shared';
import type { BlogPost } from '../../../types';

export function BlogSection() {
  const blogQuery = useAllBlogPosts();
  const { notify } = useToast();
  const deletePost = useDeleteBlogPost();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);

  const posts = blogQuery.data ?? [];

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deletePost.mutateAsync(deleting.id);
      notify({ type: 'success', title: 'Post deleted', description: `"${deleting.title}" was removed.` });
      setDeleting(null);
    } catch (err) {
      notify({ type: 'error', title: 'Could not delete post', description: extractApiError(err) });
    }
  };

  return (
    <>
      <CardTable
        title="Blog Posts"
        actions={
          <Button variant="primary" size="sm" onClick={() => { setEditing(null); setFormOpen(true); }} leftIcon={<Plus className="h-4 w-4" />}>
            New Post
          </Button>
        }
      >
        {blogQuery.isLoading ? (
          <LoadingRows rows={5} />
        ) : posts.length === 0 ? (
          <TableEmpty />
        ) : (
          <table className="w-full min-w-[680px] border-collapse">
            <thead>
              <tr className="border-b border-ink-100 bg-ink-50/60">
                <th className={thClass}>Title</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Published</th>
                <th className={thClass}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {posts.map((post) => (
                <tr key={post.id} className="transition-colors hover:bg-ink-50/60">
                  <td className={tdClass}>
                    <span className="font-medium text-ink-900">{post.title}</span>
                    <span className="block text-xs text-ink-400">/{post.slug}</span>
                  </td>
                  <td className={tdClass}>
                    <Badge tone={post.status === 'Published' ? 'forest' : post.status === 'Draft' ? 'gold' : 'neutral'}>{post.status}</Badge>
                  </td>
                  <td className={tdClass}>{post.publishedAt ? formatDate(post.publishedAt) : '—'}</td>
                  <td className={tdClass}>
                    <RowActions
                      viewUrl={`/blog/${post.slug}`}
                      onEdit={() => { setEditing(post); setFormOpen(true); }}
                      onDelete={() => setDeleting(post)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardTable>

      <BlogForm open={formOpen} post={editing} onClose={() => { setFormOpen(false); setEditing(null); }} />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete post"
        description={`Are you sure you want to delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete post"
        loading={deletePost.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
