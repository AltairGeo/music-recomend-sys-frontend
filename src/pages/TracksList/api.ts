import { track_api } from "../../features/Track/api";

import { tracksCache } from "./cache";

export async function getTracksPaginated(skip: number, limit: number) {
  const cached = tracksCache.get(skip, limit);

  if (cached) return cached;

  const data = await track_api.getTracks(skip, limit);

  tracksCache.set(skip, limit, data);

  return data;
}
