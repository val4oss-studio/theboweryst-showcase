'use client';

import { useEffect, useRef } from 'react';

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Some Brower block the autoplay — run it if needed
    video.play().catch(() => {
      // Silent: the video won't play but the site remains functional
    });
  }, []);

  return (
    <div className="video-bg" aria-hidden="true">
      <video
        ref={videoRef}
        className="video-bg-media"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/theboweryst_background_web.webm" type="video/webm" />
      </video>
      <div className="video-bg-overlay" />
    </div>
  );
}
