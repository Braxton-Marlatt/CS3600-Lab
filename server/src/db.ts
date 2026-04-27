import Database from "better-sqlite3";
import path from "path"

const db = new Database(path.join(process.cwd(), "data/app.db"));

db.exec(`PRAGMA foreign_keys = ON;`)
db.exec(`
    CREATE TABLE IF NOT EXISTS employee (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(128) NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        phone VARCHAR(24) NOT NULL,
        assets INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS department (
        name VARCHAR(10) PRIMARY KEY,
        manager INTEGER REFERENCES employee(id),
        location VARCHAR(255) NOT NULL,
        budget INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS asset (
        id VARCHAR(6) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        serial_number VARCHAR(64) NOT NULL DEFAULT '',
        category VARCHAR(64) NOT NULL,
        location VARCHAR(255) NOT NULL,
        assigned_to_employee INTEGER REFERENCES employee(id),
        assigned_to_department VARCHAR(10) REFERENCES department(name),
        status TEXT CHECK (status IN ('not-started', 'in-repair', 'finished')) NOT NULL DEFAULT 'not-started',
        purchased_date TEXT CHECK (purchased_date = date(purchased_date)) NOT NULL DEFAULT (date('now')),
        price REAL NOT NULL DEFAULT 0,
        warranty_expiration TEXT NOT NULL DEFAULT '',
        manufacturer VARCHAR(128) NOT NULL DEFAULT '',
        model VARCHAR(128) NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS employee_department (
        employee_id INTEGER REFERENCES employee(id),
        department INTEGER REFERENCES department(name),
        PRIMARY KEY (employee_id, department)
    );
`)

// Migrate existing databases — silently no-ops if the column already exists
for (const sql of [
  `ALTER TABLE asset ADD COLUMN serial_number VARCHAR(64) NOT NULL DEFAULT ''`,
  `ALTER TABLE asset ADD COLUMN price REAL NOT NULL DEFAULT 0`,
  `ALTER TABLE asset ADD COLUMN warranty_expiration TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE asset ADD COLUMN manufacturer VARCHAR(128) NOT NULL DEFAULT ''`,
  `ALTER TABLE asset ADD COLUMN model VARCHAR(128) NOT NULL DEFAULT ''`,
  `ALTER TABLE asset ADD COLUMN notes TEXT NOT NULL DEFAULT ''`,
]) {
  try { db.exec(sql) } catch {}
}

export default db;
