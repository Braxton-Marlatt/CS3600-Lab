# Database

SQLite database stored at `data/app.db`. The schema is created automatically on server start via `src/db.ts`.

## Schema

### `employee`

| Column    | Type         | Notes                  |
|-----------|--------------|------------------------|
| id        | INTEGER      | Primary key, autoincrement |
| name      | VARCHAR(255) | Required               |
| email     | VARCHAR(128) | Required               |
| job_title | VARCHAR(255) | Required               |
| phone     | VARCHAR(24)  | Required               |
| assets    | INTEGER      | Default 0              |

### `department`

| Column   | Type         | Notes                          |
|----------|--------------|--------------------------------|
| name     | VARCHAR(10)  | Primary key                    |
| manager  | INTEGER      | FK → employee(id), nullable    |
| location | VARCHAR(255) | Required                       |
| budget   | INTEGER      | Default 0                      |

### `asset`

| Column                | Type         | Notes                                              |
|-----------------------|--------------|----------------------------------------------------|
| id                    | VARCHAR(6)   | Primary key, format `A-XXXX` (auto-generated)      |
| name                  | VARCHAR(255) | Required                                           |
| serial_number         | VARCHAR(64)  | Default ''                                         |
| category              | VARCHAR(64)  | Required                                           |
| location              | VARCHAR(255) | Required                                           |
| assigned_to_employee  | INTEGER      | FK → employee(id), nullable                        |
| assigned_to_department| VARCHAR(10)  | FK → department(name), nullable                    |
| status                | TEXT         | `not-started` \| `in-repair` \| `finished`         |
| purchased_date        | TEXT         | ISO date string, default today                     |
| price                 | REAL         | Default 0                                          |
| warranty_expiration   | TEXT         | ISO date string, default ''                        |
| manufacturer          | VARCHAR(128) | Default ''                                         |
| model                 | VARCHAR(128) | Default ''                                         |
| notes                 | TEXT         | Default ''                                         |

### `employee_department`

Junction table linking employees to departments (many-to-many).

| Column      | Type        | Notes                         |
|-------------|-------------|-------------------------------|
| employee_id | INTEGER     | FK → employee(id), PK         |
| department  | INTEGER     | FK → department(name), PK     |

## Seeding

Sample data is in `seed.sql`. To apply it:

```bash
sqlite3 data/app.db < data/seed.sql
```

Note: the seed assumes an empty database. Running it twice will fail on duplicate primary keys.
