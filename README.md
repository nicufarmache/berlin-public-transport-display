# Berlin Public Transport Display

A retro digital board display showing real-time Berlin public transport departures for nearby stations (powered by the VBB HAFAS API).

## Features

- **Automatic Location Detection**: Uses Geolocation API or query params (`?lat=...&long=...`) to locate nearby transit stations.
- **Live Departures**: Fetches real-time departures from the VBB HAFAS API and auto-refreshes every 30 seconds.
- **Retro LED Board Display**: Vintage amber digital display styling with custom dot-matrix fonts and blink indicator.

## Getting Started

### Development Server

Start the local Vite development server:

```bash
npm run dev
# or
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

Run unit tests using Vitest:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

### Production Build

Create an optimized production bundle in the `dist` folder:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

