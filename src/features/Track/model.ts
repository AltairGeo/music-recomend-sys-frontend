export interface TrackModel {
  id: number;
  title: string;
  artist: string;
  genre: string;
  year: number;
  album: string;
  additional_info: string;
  license: string;
  audio_url: string;
}

export interface RandomTracksResponseAPI {
  tracks: TrackModel[];
  total: number;
}
