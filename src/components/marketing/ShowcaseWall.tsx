import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { AutoVideo } from './AutoVideo';
import { getShowcase, type ShowcaseScene } from '@/services/showcase.service';
import { PATHS } from '@/routes/paths';

/**
 * Showcase wall (higgsfield "preset wall" pattern): a dense grid of real
 * generated scene clips, autoplaying when scrolled into view, each with its
 * theme tag. A single conversion CTA — "Make mine" — ties the wall to the
 * generator. Renders nothing when empty so pages stay clean pre-population.
 */
export function ShowcaseWall({
  title = 'Made with Video Sync',
  subtitle = 'Every clip below was generated end-to-end by the platform — research, script, voiceover, motion, render.',
  maxScenes = 12,
  ctaLabel = 'Make mine',
}: {
  title?: string;
  subtitle?: string;
  maxScenes?: number;
  ctaLabel?: string;
}) {
  const [scenes, setScenes] = useState<ShowcaseScene[]>([]);

  useEffect(() => {
    let alive = true;
    getShowcase().then((d) => {
      if (!alive) return;
      // mix orientations for a fuller wall, portrait-heavy sources included
      const mixed = [...d.scenes].sort((a, b) => {
        if (a.orientation !== b.orientation) return a.orientation === 'portrait' ? -1 : 1;
        return a.source.localeCompare(b.source);
      });
      setScenes(mixed.slice(0, maxScenes));
    });
    return () => {
      alive = false;
    };
  }, [maxScenes]);

  if (scenes.length === 0) return null;

  return (
    <Box sx={{ py: { xs: 6, md: 9 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
        {subtitle}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gridAutoRows: '1fr',
        }}
      >
        {scenes.map((s) => (
          <Box key={s.url} sx={{ position: 'relative', '&:hover .scene-tag': { opacity: 1 } }}>
            <AutoVideo
              src={s.url}
              sx={{
                aspectRatio: s.orientation === 'portrait' ? '9 / 14' : '16 / 9',
              }}
            />
            <Chip
              className="scene-tag"
              label={s.title}
              size="small"
              sx={{
                position: 'absolute',
                left: 8,
                bottom: 8,
                opacity: 0,
                transition: 'opacity 0.25s',
                bgcolor: 'rgba(11,11,20,0.72)',
                color: 'text.primary',
                backdropFilter: 'blur(4px)',
                maxWidth: 'calc(100% - 16px)',
                fontSize: 12,
              }}
            />
          </Box>
        ))}
      </Box>
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" size="large" component={RouterLink} to={PATHS.REGISTER}>
          {ctaLabel}
        </Button>
      </Box>
    </Box>
  );
}
