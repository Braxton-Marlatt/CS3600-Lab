# IT Asset Inventory App

A full-stack web application for tracking and managing IT assets across departments and employees.

## Project Structure

```
.
├── frontend/      # React frontend (TypeScript + Vite + Tailwind CSS)
└── server/   # Node.js backend (Express + TypeScript + SQLite)
```

## Overview

The app lets users view and manage IT assets, departments, and employees through a dashboard interface. The frontend communicates with a REST API backed by a SQLite database.

## Getting Started

To build the project:

```bash
docker compose up
```

## Tech Stack

| Layer    | Technology                                                |
|----------|-----------------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router v7 |
| Backend  | Node.js, Express 5, TypeScript                            |
| Database | SQLite                                                    |