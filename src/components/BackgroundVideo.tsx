import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface BackgroundVideoProps {
  streamUrl?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  streamUrl = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay fallback for strict browser permissions
          console.warn('Autoplay prevented. User interaction required.');
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS for Safari/iOS
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {
          console.warn('Native video autoplay was interrupted.');
        });
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-center opacity-40 brightness-75 contrast-125 scale-105 transform transition-opacity duration-1000"
      />

      {/* 200px Top Fade to pitch black */}
      <div
        className="absolute top-0 left-0 right-0 h-[200px] z-10"
        style={{
          background: 'linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* 200px Bottom Fade to pitch black */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] z-10"
        style={{
          background: 'linear-gradient(0deg, #000000 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Full ambient dark gradient overlay for enhanced readability & cinematic depth */}
      <div className="absolute inset-0 bg-black/60 backdrop-brightness-90 z-10" />

      {/* Radial soft spotlight highlight */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
