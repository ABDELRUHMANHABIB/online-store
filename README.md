# Abdelrahman Online Store

A responsive e-commerce storefront built with React and Vite. Browse product
categories, search products, view product details, and manage a cart and
favorites list. Product catalog data is provided by the DummyJSON API.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Getting started

```sh
npm ci
npm run dev
```

Vite prints the local development URL after the server starts.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

There is currently no automated test script configured.

## Production deployment

The project can be deployed to Vercel as a Vite application:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

The included `vercel.json` rewrites client-side routes to the app entry point,
so pages such as `/cart` and `/products/1` work when opened directly.

The app fetches product data from `https://dummyjson.com`; the deployed site
needs network access to that API. No environment variables are required.
