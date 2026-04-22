import Database from "better-sqlite3";
import path from "path"

const db = new Database(path.join(__dirname, "../data/app.db"));

// Create the db schema on server start
db.exec(`PRAGMA foreign_keys = ON;`) // enforces valid foreign key (they have to map to real record)
db.exec(`
    CREATE TABLE IF NOT EXISTS department (
        name VARCHAR(10) PRIMARY KEY,
        manager INTEGER, -- can not be a reference to employee
        -- SQLITE can not create a table containing the reference to another table that does not exist
        -- We need to have app-level validation (only option)
        location VARCHAR(255) NOT NULL,
        total_assets INTEGER NOT NULL DEFAULT 0,
        budget INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS employee (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(128) NOT NULL,
        department VARCHAR(10) REFERENCES department(name),
        job_title VARCHAR(255) NOT NULL,
        phone VARCHAR(24) NOT NULL,
        assets INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS asset (
        id VARCHAR(6) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        location VARCHAR(255) NOT NULL,
        assigned_to_employee INTEGER REFERENCES employee(id),
        assigned_to_department VARCHAR(10) REFERENCES department(name),
        status TEXT CHECK (status IN ('not-started', 'in-repair', 'finished')) NOT NULL DEFAULT 'not-started',
        purchased_date TEXT CHECK (purchased_date = date(purchased_date)) NOT NULL DEFAULT (date('now'))
    );
`)

export default db;