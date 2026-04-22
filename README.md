# IT Asset Inventory App

A full-stack web application for tracking and managing IT assets across departments and employees.

## Project Structure

```
.
├── app/      # React frontend (TypeScript + Vite + Tailwind CSS)
└── server/   # Node.js backend (Express + TypeScript + SQLite)
```

## Overview

The app lets users view and manage IT assets, departments, and employees through a dashboard interface. The frontend communicates with a REST API backed by a SQLite database.

## Getting Started

Each part of the project has its own setup guide:

- [Frontend (app)](./app/README.md) — React + Vite dev server on port 5173
- [Backend (server)](./server/README.md) — Express API server on port 8080

Start the server first, then the frontend.

## Tech Stack

| Layer    | Technology                                                |
|----------|-----------------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router v7 |
| Backend  | Node.js, Express 5, TypeScript                            |
| Database | SQLite                                                    |