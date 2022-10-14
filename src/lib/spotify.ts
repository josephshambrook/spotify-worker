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
