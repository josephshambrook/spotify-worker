import { SpotifyAccessTokenResponse } from "../types";

type getAccessTokenParams = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

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

type getTopTracksParams = {
  accessToken: string;
  type: string;
  timeRange: string;
  limit: string;
  offset: string;
};

export const getTopTracks = ({
  accessToken,
  type,
  timeRange,
  limit,
  offset,
}: getTopTracksParams): Promise<SpotifyApi.UsersTopTracksResponse> => {
  return fetch(
    `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
    {
      cf: {
        cacheTtl: 3600,
        cacheEverything: true,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((r) => r.json());
};
