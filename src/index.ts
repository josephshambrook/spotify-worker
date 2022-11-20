import { Router } from "itty-router";
import { getAccessToken, getTopTracks } from "./lib/spotify";
import { mapTracks } from "./lib/utils";

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

  // all search parameter options
  const type = url.searchParams.get("type") ?? "tracks";
  const timeRange = url.searchParams.get("time_range") ?? "short_term";
  const limit = url.searchParams.get("limit") ?? "20";
  const offset = url.searchParams.get("offset") ?? "0";

  const rawResponse = await getTopTracks({
    accessToken: access_token,
    type,
    timeRange,
    limit,
    offset,
  });

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
