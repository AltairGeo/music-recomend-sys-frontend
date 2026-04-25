import type {
  ListTracksResponseAPI,
  ListTracksPaginationResponseAPI,
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
}
