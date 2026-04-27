# IT Asset Inventory App

A full-stack web application for tracking and managing IT assets across departments and employees.

## Project Structure

```
.
├── frontend/      # React frontend (TypeScript + Vite + Tailwind CSS)
└── server/        # Node.js backend (Express + TypeScript + SQLite)
```

## Overview

The app lets users view and manage IT assets, departments, and employees through a dashboard interface. The frontend communicates with a REST API backed by a SQLite database.

## Getting Started

Create the `/data` folder in the project root before the first run (this is where the database is stored):

```bash
mkdir data
```

Then build and start the full stack with Docker:

```bash
docker compose up --build
```

The app is available at `http://localhost:3000`.

To apply changes after editing source files, rebuild the image:

```bash
docker compose up --build
```

## Tech Stack

| Layer    | Technology                                                |
|----------|-----------------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router v7 |
| Backend  | Node.js, Express 5, TypeScript                            |
| Database | SQLite (better-sqlite3)                                   |

## Pages

| Page        | Route        | Description                                      |
|-------------|--------------|--------------------------------------------------|
| Dashboard   | `/`          | Live stats, recent assets, top employee assignments |
| Assets      | `/assets`    | Browse, filter, view, edit, and delete assets    |
| Add Asset   | `/add-asset` | Form to add a new asset to the inventory         |
| Employees   | `/employees` | Manage employees and their department assignments |
| Departments | `/departments` | Manage departments and their budgets           |

## Development

See [server/README.md](server/README.md) and [frontend/README.md](frontend/README.md) for running each service individually without Docker.
