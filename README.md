# Spotify Stats Web Worker

A tiny API to retrieve statistics from Spotify for a specific account. Designed to be deployed using [Cloudflare Workers], and built using [Miniflare] to enable things like local development and testing.

## Usage

### Spotify and environment setup

Before starting up the repo, you will need to obtain authentication from Spotify to use your account. I have created a script to handle the difficult part of this process, which you can use by running:

```shell
npm run spotify:auth
```

This will give you a Refresh Token, which will then be used repeatedly to keep the worker authenticated to use Spotify data.

You will then need to save some secret values with Wrangler, so that the Web Worker can access them. You will need to run the following to save these values:

```shell
wrangler secret put SPOTIFY_CLIENT_ID
# Paste your Spotify Client ID when prompted

wrangler secret put SPOTIFY_CLIENT_SECRET
# Paste your Spotify Client Secret when prompted

wrangler secret put SPOTIFY_REFRESH_TOKEN
# Paste your Refresh Token when prompted
```

Once this is complete, you should be able to make successful calls to the Web Worker's endpoint.

### Worker setup

1. Clone the repo, and install dependencies using `npm install`
2. Run `npm run dev` to start the local development server (with live reload!)
3. You should now be able to make calls to the endpoints exposed (listed below), and get data back.

### Other commands

```shell
# Start remote development server using wrangler
$ npm run dev:remote

# Run tests - these have not been implemented yet but will be!
$ npm test

# Run type checking
$ npm run types:check

# Deploy using wrangler
$ npm run deploy
```

## Endpoints

- `/top`
  Retrieves a list of top tracks for the Spotify account

[cloudflare workers]: https://workers.cloudflare.com/
[miniflare]: https://github.com/cloudflare/miniflare
