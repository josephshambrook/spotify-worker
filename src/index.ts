import { getAccessToken } from "./lib/spotify";
import { Router } from "itty-router";
import { mapTracks } from "./lib/mapping";

const router = Router();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

router.get("/top", async (request, env, context) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    env;

  const { access_token } = await getAccessToken({
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    refreshToken: SPOTIFY_REFRESH_TOKEN,
  });

  const url = new URL(request.url);

  const type = url.searchParams.get("type") ?? "tracks";
  const time_range = url.searchParams.get("time_range") ?? "short_term";
  const limit = url.searchParams.get("limit") ?? "20";
  const offset = url.searchParams.get("offset") ?? "0";

  const rawResponse: SpotifyApi.UsersTopTracksResponse = await fetch(
    `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${limit}&offset=${offset}`,
    {
      cf: {
        cacheTtl: 3600,
        cacheEverything: true,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  ).then((r) => r.json());

  const mappedResponse = mapTracks(rawResponse.items);

  return new Response(JSON.stringify(mappedResponse), {
    headers: {
      "content-type": "application/json",
      "Cache-Control": "max-age=3600",
      ...corsHeaders,
    },
  });
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
  fetch: router.handle,
};
