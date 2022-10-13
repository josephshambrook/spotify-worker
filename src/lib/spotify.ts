// import { Buffer } from 'buffer/';
import { SpotifyAccessTokenResponse } from "../types/spotify";
import { base64Encode } from "./base64";

type getAccessTokenParams = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

// const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
// const basic = new TextEncoder().encode(
//   `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
// );

export const getAccessToken = ({
  clientId,
  clientSecret,
  refreshToken,
}: getAccessTokenParams): Promise<SpotifyAccessTokenResponse> => {
  const basic = btoa(`${clientId}:${clientSecret}`);

  return fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      return r as SpotifyAccessTokenResponse;
    });
};
