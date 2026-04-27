# Backend — Node.js + Express + TypeScript

The backend is an Express 5 REST API written in TypeScript backed by a SQLite database (better-sqlite3).

## Prerequisites

- [Node.js](https://nodejs.org/en) 18+

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

3. Create the data directory for the database:
   ```bash
   mkdir -p data
   ```

## Development

Start the server with hot-reload via nodemon:

```bash
npm run dev
```

The API is available at `http://localhost:3000`.  
Health check: `http://localhost:3000/api/health`

## Build

Compile TypeScript to `dist/`:

```bash
npm run build
```

## Production

Run the compiled output:

```bash
npm start
```

## API Endpoints

### Health

| Method | Path         | Description  |
|--------|--------------|--------------|
| GET    | /api/health  | Health check |

### Dashboard

| Method | Path           | Description                                          |
|--------|----------------|------------------------------------------------------|
| GET    | /api/dashboard | Live stats, assets by dept, recent assets/assignments |

### Assets

| Method | Path              | Description              |
|--------|-------------------|--------------------------|
| GET    | /api/assets       | List all assets          |
| POST   | /api/assets       | Add a new asset (ID auto-generated) |
| PUT    | /api/assets/:id   | Update an asset by ID    |
| DELETE | /api/assets/:id   | Delete an asset by ID    |

### Employees

| Method | Path                    | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | /api/employees          | List all employees                 |
| POST   | /api/employee           | Add a new employee                 |
| GET    | /api/get-department-names | List department names (for dropdowns) |
| POST   | /api/assign-department  | Assign an employee to a department |

### Departments

| Method | Path             | Description          |
|--------|------------------|----------------------|
| GET    | /api/departments | List all departments |
| POST   | /api/departments | Add a new department |

## Database

SQLite database is stored at `data/app.db`. The schema is created automatically on first start. See [data/DATABASE.md](data/DATABASE.md) for the schema.

To seed the database with sample data:

```bash
sqlite3 data/app.db < data/seed.sql
```
