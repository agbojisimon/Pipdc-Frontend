import { Link } from 'react-router-dom';
import { Newspaper, Tag as TagIcon } from 'lucide-react';
import { useBlogPosts, useBlogCategories } from '../../hooks/queries';
import { formatDate } from '../../utils/format';

export function BlogSidebar() {
  const { data: posts = [] } = useBlogPosts();
  const { data: categories = [] } = useBlogCategories();
  const latest = posts.slice(0, 5);

  return (
    <aside className="space-y-8">
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold text-ink-900">Latest Posts</h3>
        <div className="mt-4 space-y-4">
          {latest.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex gap-3 transition-colors hover:text-forest-600"
            >
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-ink-50">
                {post.coverImageUrl ? (
                  <img src={post.coverImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-300">
                    <Newspaper className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900 line-clamp-2 group-hover:text-forest-600">{post.title}</p>
                <p className="mt-0.5 text-xs text-ink-400">{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft">
          <h3 className="font-display text-lg font-semibold text-ink-900">Categories</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/blog?category=${cat.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-600 transition-colors hover:border-forest-500 hover:bg-forest-50 hover:text-forest-700"
              >
                <TagIcon className="h-3 w-3" />
                {cat.name}
                {cat.blogPostCount > 0 && <span className="text-ink-400">({cat.blogPostCount})</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
