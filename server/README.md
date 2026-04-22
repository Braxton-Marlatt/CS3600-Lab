# Backend — Node.js + Express + TypeScript

The backend is an Express 5 REST API written in TypeScript

- [Node](https://nodejs.org/en)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in this directory - just copy the example:


### Development

To start the backend server run:

```bash
npm run dev
```

The API is available at `http://localhost:8080`.
To check the server is working go to `http://localhost:8080/api/health` where you should see {"status":"ok"}

### Build

To build a production optimized build run:

```bash
npm run build
```
Output is written to `dist/`.

### Production

To run the optimized production server run:

```bash
npm start
```

### API Endpoints

| Method | Path         | Description       |
|--------|--------------|-------------------|
| GET    | /api/health  | Health check      |