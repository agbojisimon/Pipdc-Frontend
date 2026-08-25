import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, User } from 'lucide-react';
import Markdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import { Badge } from '../../components/ui/Badge';
import { useBlogPost, useRelatedPosts } from '../../hooks/queries';
import { formatDate } from '../../utils/format';
import { PageLoader } from '../../components/ui/Spinner';
import { KeyQuote } from '../../components/blog/KeyQuote';
import { ShareButtons } from '../../components/blog/ShareButtons';
import { BlogSidebar } from '../../components/blog/BlogSidebar';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useBlogPost(slug);
  const { data: related = [] } = useRelatedPosts(slug);

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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const metaTitle = `${post.title} — PIPDC Insights`;
  const metaDescription = post.excerpt ?? post.title;

  return (
    <div className="section-pad bg-white">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {post.coverImageUrl && <meta property="og:image" content={post.coverImageUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content={post.coverImageUrl ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {post.coverImageUrl && <meta name="twitter:image" content={post.coverImageUrl} />}
      </Helmet>

      <div className="container-x">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-forest-600 hover:text-forest-700">
          <ArrowLeft className="h-4 w-4" /> All insights
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_280px]">
          <article className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {post.categoryName && <Badge tone="forest">{post.categoryName}</Badge>}
              {post.tags.map((tag) => (
                <Badge key={tag.id} tone="neutral">{tag.name}</Badge>
              ))}
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

            {post.keyQuote && <KeyQuote quote={post.keyQuote} />}

            <div className="prose prose-ink mt-8 max-w-none">
              <Markdown
                components={{
                  h1: ({ children }) => <h1 className="heading-2 mt-8 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="heading-3 mt-6 mb-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-xl font-semibold text-ink-900 mt-4 mb-2">{children}</h3>,
                  p: ({ children }) => <p className="mb-4 text-ink-700 leading-relaxed">{children}</p>,
                  blockquote: ({ children }) => (
                    <blockquote className="my-6 border-l-4 border-forest-500 bg-forest-50/50 pl-4 py-3 italic text-forest-800">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => <ul className="mb-4 list-disc pl-6 text-ink-700">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-4 list-decimal pl-6 text-ink-700">{children}</ol>,
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-forest-600 underline hover:text-forest-700">
                      {children}
                    </a>
                  ),
                }}
              >
                {post.content}
              </Markdown>
            </div>

            {post.authorName && (
              <div className="mt-10 flex items-center gap-4 rounded-2xl border border-ink-100 bg-ink-50/60 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-100 text-forest-600">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{post.authorName}</p>
                  <p className="text-xs text-ink-400">Author</p>
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-ink-100 pt-6">
              <ShareButtons url={shareUrl} title={post.title} />
            </div>

            {related.length > 0 && (
              <div className="mt-12">
                <h3 className="font-display text-xl font-semibold text-ink-900">Related Posts</h3>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to={`/blog/${r.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        {r.coverImageUrl ? (
                          <img src={r.coverImageUrl} alt={r.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-ink-50 text-ink-300">
                            <Clock className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex flex-wrap gap-1">
                          {r.categoryName && <Badge tone="forest">{r.categoryName}</Badge>}
                        </div>
                        <h4 className="mt-2 font-display text-sm font-semibold leading-snug text-ink-900 line-clamp-2 group-hover:text-forest-600">{r.title}</h4>
                        <p className="mt-1 text-xs text-ink-400">{r.publishedAt ? formatDate(r.publishedAt) : formatDate(r.createdAt)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
