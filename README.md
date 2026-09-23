# NAP Shorter (Legacy)

> [!IMPORTANT]
> This repository contains a legacy implementation of NAP Shorter. It is no longer actively maintained and is being preserved as a public archive.

NAP Shorter is a URL shortener originally deployed on Cloudflare. This repository contains the web application and edge backend used by the service during this implementation's lifetime.

## What this repository contains

- A React + TypeScript frontend built with Vite and Tailwind CSS.
- Cloudflare Pages Functions for redirects and API endpoints.
- Cloudflare D1 for short-link and analytics data.
- Cloudflare KV for auxiliary edge data.
- Cloudflare Turnstile integration for abuse protection.
- Normal short links with optional expiration.
- Private/encrypted short links.
- Redirect analytics and URL risk/blocking checks.

The code reflects the architecture and requirements of the service at the time it was developed and is kept primarily for historical and reference purposes.

## Development

The project uses Yarn and Wrangler.

```sh
yarn install
yarn dev
```

Other available scripts include:

```sh
yarn lint
yarn build:pack
yarn deploy
```

Running the complete application requires compatible Cloudflare D1, KV, Turnstile, and Pages configuration. The identifiers and configuration committed to this repository belong to its historical deployment and should not be assumed to be suitable for a new deployment.

## Project status

This project is no longer actively maintained. The repository is intended to remain available as a public archive and reference to the implementation.

## License

This project is licensed under the [MIT License](LICENSE).
