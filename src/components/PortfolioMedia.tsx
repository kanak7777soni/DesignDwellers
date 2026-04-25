import Image from 'next/image';
import type { ProjectMedia } from '@/lib/portfolio';

type PortfolioMediaProps = {
  media: ProjectMedia;
  sizes: string;
  className?: string;
  priority?: boolean;
  showVideoControls?: boolean;
};

export default function PortfolioMedia({
  media,
  sizes,
  className = 'object-cover',
  priority = false,
  showVideoControls = false,
}: PortfolioMediaProps) {
  if (media.type === 'video') {
    return (
      <video
        src={media.src}
        poster={media.poster}
        aria-label={media.alt}
        className={`h-full w-full ${className}`}
        autoPlay={!showVideoControls}
        muted={!showVideoControls}
        loop={!showVideoControls}
        playsInline
        preload="metadata"
        controls={showVideoControls}
      />
    );
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
