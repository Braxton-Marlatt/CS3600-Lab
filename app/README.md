# Frontend — React + TypeScript + Vite

The frontend is a React 19 single-page application built with Vite, TypeScript, and Tailwind CSS.

### Prerequisites

- [npm](https://nodejs.org/en) (Node.js 18+)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure the backend server is running on port 8080 (see [server README](../server/README.md)).
   
*(Right now the server does nothing)*

### Development

Start the Vite dev server:

```bash
npm run dev
```

The app is available at `http://localhost:5173`. The page hot-reloads on file changes.

### Build

To build a production optimized build run:

```bash
npm run build
```

Output is written to `dist/`.

### Preview Production Build

Serve the built output locally:

```bash
npm preview
```

The preview server runs on `http://localhost:4173`.