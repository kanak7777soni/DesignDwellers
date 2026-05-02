/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type InstagramVideo = {
  id: string;
  caption: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  permalink: string;
  timestamp: string | null;
  username: string | null;
  isReel: boolean;
};

type InstagramFeedResponse = {
  configured: boolean;
  videos: InstagramVideo[];
  profile: {
    username: string | null;
    url: string | null;
  };
  error?: string;
};

type FeedState = {
  status: 'loading' | 'ready' | 'empty' | 'error';
  configured: boolean;
  videos: InstagramVideo[];
  profile: InstagramFeedResponse['profile'];
};

const defaultProfile = {
  username: 'DesignDwellersstudio',
  url: 'https://www.instagram.com/designdwellersstudio/',
};

const fallbackPosts = Array.from({ length: 6 }, (_, index) => ({
  id: `fallback-instagram-${index + 1}`,
  caption: 'Modular Kitchen Reveal',
}));
const VIDEO_VISIBILITY_THRESHOLD = 0.35;

export default function InstagramSection() {
  const [feed, setFeed] = useState<FeedState>({
    status: 'loading',
    configured: false,
    videos: [],
    profile: defaultProfile,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadInstagramVideos() {
      try {
        const response = await fetch('/api/instagram/videos', { cache: 'no-store' });
        const payload = (await response.json()) as InstagramFeedResponse;

        if (!isMounted) {
          return;
        }

        setFeed({
          status: response.ok && payload.videos.length > 0 ? 'ready' : response.ok ? 'empty' : 'error',
          configured: payload.configured,
          videos: payload.videos || [],
          profile: {
            username: payload.profile?.username || defaultProfile.username,
            url: payload.profile?.url || defaultProfile.url,
          },
        });
      } catch {
        if (!isMounted) {
          return;
        }

        setFeed({
          status: 'error',
          configured: true,
          videos: [],
          profile: defaultProfile,
        });
      }
    }

    loadInstagramVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const username = feed.profile.username?.replace(/^@/, '') || defaultProfile.username;
  const profileUrl = feed.profile.url || defaultProfile.url;

  return (
    <section className="w-full" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="max-w-[1440px] mx-auto px-[80px]">
        {/* Section header */}
        <div className="relative" style={{ width: '290px', height: '19px', marginBottom: '10px' }}>
          <span
            className="font-heading absolute"
            style={{ left: '0', top: '0', fontSize: '16px', lineHeight: '1.17em', color: '#D7A648', WebkitTextStroke: '0.5px #D8A648' }}
          >
            As Seen On Instagram
          </span>
          <div className="absolute" style={{ left: '162px', top: '16px', width: '128px', height: '1px', background: '#D7A648' }} />
        </div>

        {/* Title + subtitle + handle */}
        <div className="flex justify-between items-start mb-[30px]">
          <h2 className="font-heading" style={{ fontSize: '48px', lineHeight: '1.17em', color: '#FFFFFF', maxWidth: '351px' }}>
            Behind the scenes &amp; before-afters
          </h2>
          <div className="flex flex-col items-end gap-[10px]">
            <p className="font-body text-right" style={{ fontSize: '16px', lineHeight: '1em', color: '#FFFFFF', maxWidth: '398px' }}>
              Real reviews. Unfiltered. From homeowners just like you.
            </p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading"
              style={{
                background: '#D7A648',
                borderRadius: '55px',
                padding: '6px 20px',
                fontSize: '16px',
                lineHeight: '1.17em',
                color: '#FFFFFF',
                border: 'none',
                height: '44px',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              {username}
            </a>
          </div>
        </div>

        <InstagramVideoGrid feed={feed} />

        {/* Navigation dots */}
        <div className="flex justify-center mt-[30px] mb-[24px]">
          <Image src="/images/testimonial-dots.svg" alt="" width={82} height={9} />
        </div>

        {/* Follow button */}
        <div className="flex justify-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[10px] font-heading"
            style={{
              background: '#D7A648',
              borderRadius: '55px',
              padding: '6px 20px',
              fontSize: '16px',
              lineHeight: '1.17em',
              color: '#FFFFFF',
              border: 'none',
              height: '44px',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
          >
            <Image src="/images/instagram-icon.svg" alt="" width={17} height={17} />
            Follow Us for Daily Inspiration
          </a>
        </div>
      </div>
    </section>
  );
}

function InstagramVideoGrid({ feed }: { feed: FeedState }) {
  if (feed.status !== 'ready') {
    return <InstagramFallbackGrid />;
  }

  return (
    <div className="flex gap-[12px]">
      {feed.videos.map((video) => (
        <InstagramVideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function InstagramVideoCard({ video }: { video: InstagramVideo }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayable = Boolean(video.videoUrl);

  useEffect(() => {
    const element = videoRef.current;

    if (!element || !isPlayable) {
      return;
    }

    const videoElement = element;
    let shouldPlay = false;

    async function playVisibleVideo() {
      if (!shouldPlay || !videoElement.paused) {
        return;
      }

      try {
        videoElement.muted = true;
        await videoElement.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }

    function pauseHiddenVideo() {
      if (!videoElement.paused) {
        videoElement.pause();
      }
      setIsPlaying(false);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        pauseHiddenVideo();
        return;
      }

      if (shouldPlay) {
        void playVisibleVideo();
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        shouldPlay = Boolean(entry?.isIntersecting && entry.intersectionRatio >= VIDEO_VISIBILITY_THRESHOLD);

        if (shouldPlay && !document.hidden) {
          void playVisibleVideo();
          return;
        }

        pauseHiddenVideo();
      },
      {
        threshold: [0, 0.2, VIDEO_VISIBILITY_THRESHOLD, 0.6, 1],
      },
    );

    observer.observe(videoElement);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      pauseHiddenVideo();
    };
  }, [isPlayable, video.videoUrl]);

  async function playVideo() {
    const element = videoRef.current;

    if (!element || !isPlayable) {
      return;
    }

    try {
      element.muted = true;
      await element.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  function pauseVideo() {
    const element = videoRef.current;

    if (!element || !isPlayable) {
      return;
    }

    element.pause();
    setIsPlaying(false);
  }

  async function togglePlayback() {
    if (!isPlayable) {
      window.open(video.permalink, '_blank', 'noopener,noreferrer');
      return;
    }

    if (isPlaying) {
      pauseVideo();
      return;
    }

    await playVideo();
  }

  return (
    <article
      className="relative group overflow-hidden"
      style={{ width: '204px', height: '363px', flexShrink: 0, background: '#0f0f0f' }}
    >
      {isPlayable ? (
        <video
          ref={videoRef}
          src={video.videoUrl || undefined}
          poster={video.thumbnailUrl || undefined}
          className="h-full w-full object-cover zoom-image"
          muted
          loop
          playsInline
          preload="metadata"
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      ) : video.thumbnailUrl ? (
        <img src={video.thumbnailUrl} alt={video.caption} className="h-full w-full object-cover zoom-image" />
      ) : (
        <div className="h-full w-full flex items-center justify-center" style={{ background: '#0f0f0f' }}>
          <Image src="/images/instagram-icon.svg" alt="" width={42} height={42} />
        </div>
      )}

      <button
        type="button"
        onClick={togglePlayback}
        className="absolute inset-0 flex items-center justify-center"
        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        aria-label={isPlayable ? (isPlaying ? 'Pause Instagram video' : 'Play Instagram video') : 'Open Instagram reel'}
      >
        <Image src="/images/instagram-overlay.svg" alt="" width={41} height={41} style={{ opacity: 0.7 }} />
      </button>

      <p
        className="font-body absolute text-right"
        style={{ bottom: '24px', right: '8px', fontSize: '7px', lineHeight: '1em', color: '#FFFFFF' }}
      >
        {video.caption}
      </p>
      <div className="absolute" style={{ bottom: '20px', left: '8px', right: '8px', height: '1px', background: '#D7A648' }} />
    </article>
  );
}

function InstagramFallbackGrid() {
  return (
    <div className="flex gap-[12px]">
      {fallbackPosts.map((post) => (
        <div key={post.id} className="relative group overflow-hidden" style={{ width: '204px', height: '363px', flexShrink: 0 }}>
          <Image
            src="/images/instagram-post.png"
            alt={post.caption}
            fill
            className="object-cover zoom-image"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Image src="/images/instagram-overlay.svg" alt="" width={41} height={41} style={{ opacity: 0.7 }} />
          </div>
          <p
            className="font-body absolute text-right"
            style={{ bottom: '24px', right: '8px', fontSize: '7px', lineHeight: '1em', color: '#FFFFFF' }}
          >
            {post.caption}
          </p>
          <div className="absolute" style={{ bottom: '20px', left: '8px', right: '8px', height: '1px', background: '#D7A648' }} />
        </div>
      ))}
    </div>
  );
}
