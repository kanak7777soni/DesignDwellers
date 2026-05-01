import Image from 'next/image';
import type { ProjectMedia } from '@/lib/portfolio';

type PortfolioMediaProps = {
  media: ProjectMedia;
  sizes: string;
  className?: string;
  priority?: boolean;
  showVideoControls?: boolean;
};

function isRemoteUrl(src: string) {
  return /^https?:\/\//i.test(src);
}

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

  if (isRemoteUrl(media.src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.src}
        alt={media.alt}
        className={`h-full w-full ${className}`}
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
