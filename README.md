# ParkUB Web

ParkUB is a browser-based smart parking and traffic dashboard for Ulaanbaatar. This repo now runs as a local React + Vite website, not a mobile app.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

- `npm run dev` - start the local website on port 3000
- `npm run start` - same as dev
- `npm run build` - type-check and create a production build
- `npm run preview` - preview the production build on port 3000
- `npm run typecheck` - run TypeScript checks

## Notes

- The app uses static mock data for parking spots, traffic segments, search suggestions, and route steps.
- The map is rendered from the local `osm-2020-02-10-v3.11_asia_mongolia.mbtiles` OpenMapTiles file through a Vite tile endpoint.
- Backend, authentication, payment, voice, and reservation flows are intentionally not included.
