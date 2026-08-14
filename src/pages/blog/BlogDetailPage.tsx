import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useBlogPost } from '../../hooks/queries';
import { formatDate } from '../../utils/format';
import { PageLoader } from '../../components/ui/Spinner';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useBlogPost(slug);

  if (isLoading) return <PageLoader label="Loading article" />;

  if (isError || !post) {
    return (
      <div className="section-pad bg-white">
        <div className="container-x">
          <div className="rounded-2xl border border-ink-100 bg-ink-50 p-8 text-center">
            <h1 className="heading-3">Article not found</h1>
            <p className="mt-2 text-sm text-ink-500">This article may have been removed or unpublished.</p>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-forest-600">
              <ArrowLeft className="h-4 w-4" /> Back to insights
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="section-pad bg-white">
      <div className="container-x max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-700">
          <ArrowLeft className="h-4 w-4" /> All insights
        </Link>

        <div className="mt-6 flex items-center gap-2">
          <Badge tone="forest">{post.status}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-ink-400">
            <CalendarDays className="h-3.5 w-3.5" /> {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-ink-400">
            <Clock className="h-3.5 w-3.5" /> {post.readMinutes} min read
          </span>
        </div>

        <h1 className="heading-2 mt-4">{post.title}</h1>
        {post.excerpt && <p className="mt-3 text-lg text-ink-500">{post.excerpt}</p>}

        {post.coverImageUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl">
            <img src={post.coverImageUrl} alt={post.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="mt-8 whitespace-pre-line text-ink-700">{post.content}</div>
      </div>
    </article>
  );
}
