import Image from 'next/image';
import ViewportVideo from '@/components/ViewportVideo';
import type { ProjectMedia } from '@/lib/portfolio';

type PortfolioMediaProps = {
  media: ProjectMedia;
  sizes: string;
  className?: string;
  priority?: boolean;
};

function isRemoteUrl(src: string) {
  return /^https?:\/\//i.test(src);
}

export default function PortfolioMedia({
  media,
  sizes,
  className = 'object-cover',
  priority = false,
}: PortfolioMediaProps) {
  if (media.type === 'video') {
    return (
      <ViewportVideo
        src={media.src}
        poster={media.poster}
        ariaLabel={media.alt}
        className={`h-full w-full ${className}`}
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
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
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
