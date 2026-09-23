# NAP Shorter (Legacy)

> [!IMPORTANT]
> This repository contains the previous implementation of NAP Shorter. It is no longer actively maintained and is being preserved as a public archive.
>
> Development continues in [`napsocial/napshortener`](https://github.com/napsocial/napshortener).

NAP Shorter is a URL shortener originally deployed on Cloudflare. This repository contains the legacy web application and edge backend that powered the service before it was replaced by the current implementation.

## What this repository contains

- A React + TypeScript frontend built with Vite and Tailwind CSS.
- Cloudflare Pages Functions for redirects and API endpoints.
- Cloudflare D1 for short-link and analytics data.
- Cloudflare KV for auxiliary edge data.
- Cloudflare Turnstile integration for abuse protection.
- Normal short links with optional expiration.
- Private/encrypted short links.
- Redirect analytics and URL risk/blocking checks.

The implementation reflects the architecture and requirements of the service at the time it was developed. It should be treated as historical code rather than the current NAP Shorter architecture.

## Development

The original project uses Yarn and Wrangler.

```sh
yarn install
yarn dev
```

Other preserved scripts include:

```sh
yarn lint
yarn build:pack
yarn deploy
```

Running the complete application requires compatible Cloudflare D1, KV, Turnstile, and Pages configuration. The identifiers and configuration committed to this repository belong to the historical deployment and should not be assumed to be suitable for a new deployment.

## Project status

This repository is intended for archival and reference purposes. New development, bug fixes, and architectural changes belong in [`napsocial/napshortener`](https://github.com/napsocial/napshortener).

## License

This project is licensed under the [MIT License](LICENSE).
