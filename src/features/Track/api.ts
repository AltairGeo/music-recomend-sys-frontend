import type { TrackModel, RandomTracksResponseAPI } from "./model";
import { config } from "../../config";

export class TrackAPI {
  async getTracks() {}
  async searchTracks() {}

  async getRandomTrack(n: number): Promise<TrackModel[]> {
    const url = `${config.api.baseUrl}/api/v1/tracks/random?n=${n}`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to fetch tracks: ${res.status}`);
    }

    const data: RandomTracksResponseAPI = await res.json();
    return data.tracks;
  }
}
