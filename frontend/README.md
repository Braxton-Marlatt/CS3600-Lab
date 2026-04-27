# Frontend — React + TypeScript + Vite

The frontend is a React 19 single-page application built with Vite, TypeScript, and Tailwind CSS.

## Prerequisites

- [Node.js](https://nodejs.org/en) 18+

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. The backend URL is configured via environment variables:
   - `.env` — used in development (default: `http://localhost:3000`)
   - `.env.production` — used in production builds (default: empty, uses relative URLs)

## Development

Start the Vite dev server:

```bash
npm run dev
```

The app is available at `http://localhost:5173` with hot-reload on file changes.  
Make sure the backend server is running first (see [server README](../server/README.md)).

## Build

Compile and bundle for production:

```bash
npm run build
```

Output is written to `dist/`. The production build is served by the Express backend in Docker.

## Preview Production Build

Serve the built output locally:

```bash
npm run preview
```

The preview server runs at `http://localhost:4173`.

## Pages

| Page        | Route          | Description                                         |
|-------------|----------------|-----------------------------------------------------|
| Dashboard   | `/`            | Live stats, recent assets, top employee assignments |
| Assets      | `/assets`      | Browse, filter, view, edit, and delete assets       |
| Add Asset   | `/add-asset`   | Form to add a new asset                             |
| Employees   | `/employees`   | Manage employees and department assignments         |
| Departments | `/departments` | Manage departments and budgets                      |
