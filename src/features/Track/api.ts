import type {
  ListTracksResponseAPI,
  ListTracksPaginationResponseAPI,
  SimilarTracksResponseAPI,
  TrackModel,
} from "./model";
import { config } from "../../config";
import { API } from "../../share/api";

export class TrackAPI extends API {
  async getTracks(skip: number, limit: number) {
    return this.request<ListTracksPaginationResponseAPI>(
      `${config.api.baseUrl}/api/v1/tracks?skip=${skip}&limit=${limit}`,
    );
  }

  async searchTracks(query: string) {
    return this.request<ListTracksResponseAPI>(
      `${config.api.baseUrl}/api/v1/tracks/search?q=${query}`,
    );
  }

  async getRandomTrack(n: number) {
    return this.request<ListTracksResponseAPI>(
      `${config.api.baseUrl}/api/v1/tracks/random?n=${n}`,
    );
  }

  async getSimilarTracks(
    track_id: number,
    k: number = 10,
  ): Promise<SimilarTracksResponseAPI> {
    return this.request<SimilarTracksResponseAPI>(
      `${config.api.baseUrl}/api/v1/tracks/${track_id}/similar?k=${k}`,
    );
  }
  async getTrack(trackId: number): Promise<TrackModel> {
    return this.request<TrackModel>(
      `${config.api.baseUrl}/api/v1/tracks/${trackId}`,
    );
  }
}

export const track_api = new TrackAPI();
