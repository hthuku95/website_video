import { api } from '@/services/api';

export interface ShowcaseScene {
  kind: 'scene';
  url: string;
  source: string;
  theme: string;
  orientation: 'portrait' | 'landscape' | string;
  duration: number;
  title: string;
}

export interface ShowcaseVideo {
  kind: 'video';
  url: string;
  title: string;
  gig_type: string;
  orientation: 'portrait' | 'landscape' | string;
  delivery: string;
}

export interface ShowcaseResponse {
  success: boolean;
  scenes: ShowcaseScene[];
  videos: ShowcaseVideo[];
}

let cached: { data: ShowcaseResponse; at: number } | null = null;
const TTL_MS = 5 * 60_000;

/**
 * Public marketing showcase from the API (`GET /api/showcase`).
 *
 * Returns curated scene clips + full renders harvested from real completed
 * deliveries. The backend caches its manifest for an hour, so new renders
 * auto-enrich every marketing surface without a redeploy. On failure we
 * return empty arrays — the pages render fine without the wall.
 */
export async function getShowcase(): Promise<ShowcaseResponse> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;
  try {
    const res = await api.get<ShowcaseResponse>('/api/showcase');
    const data: ShowcaseResponse = {
      success: !!res.data?.success,
      scenes: res.data?.scenes ?? [],
      videos: res.data?.videos ?? [],
    };
    cached = { data, at: Date.now() };
    return data;
  } catch {
    return { success: false, scenes: [], videos: [] };
  }
}
