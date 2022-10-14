export type SpotifyAccessTokenResponse = {
  access_token: string;
};

export type TracksResponse = {
  name: string;
  artist: string;
  href: string;
  album: string;
  image: {
    height?: number | undefined;
    url: string;
    width?: number | undefined;
  };
};
