import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AutoVideo } from './AutoVideo';
import { getShowcase } from '@/services/showcase.service';

/**
 * Full-bleed muted looping video behind the hero content (higgsfield-style).
 * Renders nothing when the showcase has no scenes — the gradient hero stands
 * on its own, so the page never depends on the wall being populated.
 */
export function HeroVideoBackground({
  children,
  minHeight = 420,
}: {
  children: React.ReactNode;
  minHeight?: number;
}) {
  const [sceneUrl, setSceneUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getShowcase().then((d) => {
      if (!alive) return;
      const landscape = d.scenes.filter((s) => s.orientation === 'landscape');
      const pool = landscape.length > 0 ? landscape : d.scenes;
      if (pool.length > 0) {
        // deterministic rotation per page load
        const pick = pool[Math.floor(Math.random() * Math.min(pool.length, 6))];
        setSceneUrl(pick.url);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {sceneUrl && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            '& video': { width: '100%', height: '100%', objectFit: 'cover' },
          }}
        >
          <AutoVideo src={sceneUrl} radius={0} objectFit="cover" sx={{ position: 'absolute', inset: 0, borderRadius: 0 }} />
          {/* readability scrim so headline text stays crisp over the video */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(11,11,20,0.86) 0%, rgba(11,11,20,0.72) 45%, rgba(11,11,20,0.92) 100%)',
            }}
          />
        </Box>
      )}
      <Box sx={{ position: 'relative', minHeight }}>{children}</Box>
    </Box>
  );
}
