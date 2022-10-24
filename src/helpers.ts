import { Request } from "itty-router";

export const getCorsHeaders = (request: Request, originWhitelist: RegExp[]) => {
  const response = {
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Allow-Origin": "",
    "Access-Control-Max-Age": `${3600 * 12}`, // 12 hours
    Vary: "",
  };

  console.log(`request origin is ${request.headers.get("origin")}`);

  const origin = request.headers.get("origin");

  if (origin) {
    const originHostname = new URL(origin).hostname;

    if (originWhitelist.some((url) => url.test(originHostname))) {
      // Set CORS headers for allowed domains
      response["Access-Control-Allow-Origin"] = origin;

      // Append to/Add Vary header so browser will cache response correctly
      response.Vary = "Origin";
    }
  }

  return response;
};
