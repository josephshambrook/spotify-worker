#!/usr/bin/env node

/*
 * A Node.js script which, after making a couple of calls to Spotify,
 * returns a refresh token required for making calls to obtain account data
 */

const SpotifyWebApi = require("spotify-web-api-node");
const prompt = require("prompt");

const prompts = {
  clientId: {
    name: "clientId",
    description: "Client ID",
    required: true,
  },
  clientSecret: {
    name: "clientSecret",
    description: "Client Secret",
    required: true,
    hidden: true,
  },
  code: {
    name: "code",
    description: "Code",
    required: true,
  },
};

const spotifyConfig = {
  scopes: ["user-read-recently-played", "user-top-read"],
  redirectUri: "http://localhost:3000/cb",
};

async function init() {
  console.log(
    "\n\nHello! This little script will help you to get a refresh token from Spotify, which can then be used to get data from a Spotify account.",
    "\n\nTo reassure you, none of the data you add here is transferred anywhere other than Spotify. This script uses a popular npm package called `spotify-web-api-node` to handle those calls to Spotify, and your data is not used for any other purpose or transferred anywhere else.",
    "\n\nIf you are at all unsure, you can manually follow Spotify's authentication flow documentation to obtain your refresh token, but this script does make the process easier.",
    "\n\nOkay, let's get started! Login to your Spotify Developer account at the below URL to get your ** Client ID ** and ** Client Secret **, and then paste where prompted.",
    "\n"
  );

  prompt.start();

  const authorizeCredentials = await prompt.get([
    prompts.clientId,
    prompts.clientSecret,
  ]);

  const spotifyApi = new SpotifyWebApi({
    redirectUri: spotifyConfig.redirectUri,
    clientId: authorizeCredentials.clientId,
    clientSecret: authorizeCredentials.clientSecret,
  });

  // Create the authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(
    spotifyConfig.scopes,
    spotifyConfig.state
  );

  // https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice

  console.log(
    "\n\nA URL has been generated for you to visit and authorize your application to use the Spotify account's data, and to obtain a code to continue. Follow these steps to continue:",
    "\n\n1. Visit the following URL in your browser and grant permission to the application:",
    `\n\n${authorizeURL}`,
    `\n\n2. You should be redirected to a URL resembling \"${spotifyConfig.redirectUri}?code=a-secret-code\". Copy the code after \"?code=\" and paste below:`,
    "\n"
  );

  const codeCredentials = await prompt.get([prompts.code]);

  try {
    const authorizationCodeResponse = await spotifyApi.authorizationCodeGrant(
      codeCredentials.code
    );

    if (authorizationCodeResponse.body.refresh_token) {
      console.log(
        "\n\nSuccess! Your code has been accepted and your application has been granted access to the Spotify account's data",
        `\n\nYour refresh token is: ${authorizationCodeResponse.body.refresh_token}`
      );
    } else {
      throw new Error("No refresh token was returned");
    }
  } catch (err) {
    console.log(
      "\n\nUnfortunately, there was an error when trying to authenticate the code provided. Maybe try again to authorise the application, otherwise you will need to follow Spotify's documentation manually to obtain the refresh token needed.",
      "\n\nThis was the error I received:",
      `\n\n${err}`
    );
  }
}

init();
