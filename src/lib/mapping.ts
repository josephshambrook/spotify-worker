export const mapTracks = (rawResponse: SpotifyApi.TrackObjectFull[]) => {
  return rawResponse.map((track) => ({
    name: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    href: track.href,
    album: track.album.name,
    image: track.album.images[1],
  }));
};
