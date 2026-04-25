import type {
  ListTracksResponseAPI,
  ListTracksPaginationResponseAPI,
} from "./model";
import { config } from "../../config";

export class TrackAPI {
  async getTracks(
    skip: number,
    limit: number,
  ): Promise<ListTracksPaginationResponseAPI> {
    const url = `${config.api.baseUrl}/api/v1/tracks?skip=${skip}&limit=${limit}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch tracks: ${res.status}`);
    }

    const data: ListTracksPaginationResponseAPI = await res.json();
    return data;
  }

  async searchTracks(query: string): Promise<ListTracksResponseAPI> {
    const url = `${config.api.baseUrl}/api/v1/tracks/search?q=${query}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch tracks: ${res.status}`);
    }

    const data: ListTracksResponseAPI = await res.json();
    return data;
  }

  async getRandomTrack(n: number): Promise<ListTracksResponseAPI> {
    const url = `${config.api.baseUrl}/api/v1/tracks/random?n=${n}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch tracks: ${res.status}`);
    }

    const data: ListTracksResponseAPI = await res.json();
    return data;
  }
}
