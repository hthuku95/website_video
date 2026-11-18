import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';

/**
 * Autoplaying muted looping video that plays ONLY while in the viewport
 * (higgsfield pattern: videos run everywhere without hammering the network).
 * Fades in once the first frame arrives so there is never a broken-image
 * flash on slow connections.
 */
export function AutoVideo({
  src,
  poster,
  sx,
  radius = 14,
  playOnHoverOnly = false,
  objectFit = 'cover',
}: {
  src: string;
  poster?: string;
  sx?: object;
  radius?: number;
  playOnHoverOnly?: boolean;
  objectFit?: 'cover' | 'contain';
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => setVisible(entries[0]?.isIntersecting ?? false),
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const shouldPlay = visible && (!playOnHoverOnly || hovered);
    if (shouldPlay) {
      el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [visible, hovered, playOnHoverOnly]);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: radius,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        ...sx,
      }}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        onLoadedData={() => setReady(true)}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit,
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.7s ease',
        }}
      />
    </Box>
  );
}
