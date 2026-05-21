'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type ViewportVideoProps = {
  src: string;
  poster?: string;
  ariaLabel?: string;
  className?: string;
};

const VISIBILITY_THRESHOLD = 0.35;
const SOURCE_LOAD_MARGIN = '900px 0px';

export default function ViewportVideo({
  src,
  poster,
  ariaLabel,
  className,
}: ViewportVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const activeSrc = loadedSrc === src ? src : undefined;

  useEffect(() => {
    const element = videoRef.current;

    if (!element || loadedSrc === src) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setLoadedSrc(src);
          observer.disconnect();
        }
      },
      {
        rootMargin: SOURCE_LOAD_MARGIN,
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [loadedSrc, src]);

  useEffect(() => {
    const element = videoRef.current;

    if (!element || !activeSrc) {
      return;
    }

    const videoElement = element;
    let shouldPlay = false;

    async function play() {
      if (!shouldPlay || !videoElement.paused) {
        return;
      }

      try {
        videoElement.muted = true;
        await videoElement.play();
      } catch {
        // Muted autoplay can still be blocked by the browser. The next viewport
        // event will retry, and the video remains safely paused meanwhile.
      }
    }

    function pause() {
      if (!videoElement.paused) {
        videoElement.pause();
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        pause();
        return;
      }

      if (shouldPlay) {
        void play();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        shouldPlay = Boolean(entry?.isIntersecting && entry.intersectionRatio >= VISIBILITY_THRESHOLD);

        if (shouldPlay && !document.hidden) {
          void play();
          return;
        }

        pause();
      },
      {
        threshold: [0, 0.2, VISIBILITY_THRESHOLD, 0.6, 1],
      },
    );

    observer.observe(videoElement);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      pause();
    };
  }, [activeSrc]);

  const preload = useMemo(() => (activeSrc ? 'metadata' : 'none'), [activeSrc]);

  return (
    <video
      ref={videoRef}
      src={activeSrc}
      poster={poster}
      aria-label={ariaLabel}
      className={className}
      muted
      loop
      playsInline
      preload={preload}
      controls={false}
      disablePictureInPicture
    />
  );
}
