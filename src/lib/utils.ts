import { TracksResponse } from "@/types";

export const mapTracks = (
  rawResponse: SpotifyApi.TrackObjectFull[]
): TracksResponse[] => {
  return rawResponse.map((track) => ({
    name: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    href: track.external_urls.spotify,
    album: track.album.name,
    image: track.album.images[1],
  }));
};
