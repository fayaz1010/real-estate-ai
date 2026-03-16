import React from 'react';
import { X } from 'lucide-react';
import { Tip } from '@/types/tips';
import { cn } from '@/lib/utils';

interface TipCardProps {
  tip: Tip;
  onDismiss: (tipId: string, reason: string) => void;
  className?: string;
}

export const TipCard: React.FC<TipCardProps> = ({
  tip,
  onDismiss,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-primary/10 bg-white p-4 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h4 className="font-display text-sm font-semibold text-primary">
          {tip.title}
        </h4>
        <button
          onClick={() => onDismiss(tip.id, 'Not relevant')}
          className="shrink-0 rounded-md p-1 text-primary/40 transition-colors hover:bg-primary/5 hover:text-primary/70"
          aria-label="Dismiss tip"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <span className="mb-2 inline-block rounded-full bg-accent/10 px-2 py-0.5 font-body text-xs text-accent">
        {tip.featureArea}
      </span>

      <p className="mb-3 font-body text-sm leading-relaxed text-primary/70">
        {tip.description}
      </p>

      <a
        href={tip.ctaLink}
        className="inline-block rounded-lg bg-accent px-4 py-2 font-body text-sm font-medium text-white transition-colors hover:bg-accent/90"
      >
        {tip.ctaText}
      </a>
    </div>
  );
};
