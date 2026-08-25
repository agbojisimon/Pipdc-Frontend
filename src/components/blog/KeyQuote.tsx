import { Quote } from 'lucide-react';

interface KeyQuoteProps {
  quote: string;
}

export function KeyQuote({ quote }: KeyQuoteProps) {
  return (
    <div className="my-8 rounded-2xl border-l-4 border-forest-500 bg-forest-50/50 p-6">
      <div className="flex items-start gap-3">
        <Quote className="mt-0.5 h-5 w-5 flex-shrink-0 text-forest-500" />
        <p className="text-lg font-medium leading-relaxed text-forest-800 italic">{quote}</p>
      </div>
    </div>
  );
}
