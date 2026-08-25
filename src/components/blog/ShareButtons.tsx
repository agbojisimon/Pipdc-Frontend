import { Share2, Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shares = [
    {
      label: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    },
    {
      label: 'WhatsApp',
      icon: <MessageCircle className="h-4 w-4" />,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm font-medium text-ink-500">
        <Share2 className="h-4 w-4" /> Share
      </span>
      <div className="flex gap-2">
        {shares.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-colors hover:border-forest-500 hover:text-forest-600"
            title={`Share on ${s.label}`}
          >
            {s.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
