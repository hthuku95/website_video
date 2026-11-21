import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { AutoVideo } from './AutoVideo';
import { getShowcase, type ShowcaseScene } from '@/services/showcase.service';
import { PATHS } from '@/routes/paths';

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
      // dedupe by title so the wall shows distinct video types, not 7 copies
      // of the same clip (backend returns 35 scenes = 5 variants x 7 each)
      const seen = new Set<string>();
      const unique = (d.scenes ?? []).filter((s) => {
        if (!s?.url || !s?.title || seen.has(s.title)) return false;
        seen.add(s.title);
        return true;
      });
      const mixed = [...unique].sort((a, b) => {
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
        }}
      >
        {scenes.map((s) => (
          <Box
            key={s.url}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 3,
              bgcolor: 'background.paper',
              aspectRatio: s.orientation === 'portrait' ? '9 / 14' : '16 / 9',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
              },
              '&:hover .scene-tag': { opacity: 1 },
              '&:hover .play-btn': { opacity: 1, transform: 'translate(-50%, -50%) scale(1.05)' },
            }}
          >
            <AutoVideo
              src={s.url}
              sx={{
                width: '100%',
                height: '100%',
                display: 'block',
              }}
            />
            {/* play affordance — signals playable media, centered */}
            <Box
              className="play-btn"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                bgcolor: 'rgba(11,11,20,0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.25s, transform 0.25s',
                pointerEvents: 'none',
              }}
            >
              <PlayArrowRoundedIcon sx={{ fontSize: 28, color: 'common.white', ml: 0.5 }} />
            </Box>
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

