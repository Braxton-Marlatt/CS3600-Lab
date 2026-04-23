import Database from "better-sqlite3";
import path from "path"

const db = new Database(path.join(process.cwd(), "data/app.db"));

// Create the db schema on server start
db.exec(`PRAGMA foreign_keys = ON;`) // enforces valid foreign key (they have to map to real record)
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
        category VARCHAR(64) NOT NULL,
        location VARCHAR(255) NOT NULL,
        assigned_to_employee INTEGER REFERENCES employee(id),
        assigned_to_department VARCHAR(10) REFERENCES department(name),
        status TEXT CHECK (status IN ('not-started', 'in-repair', 'finished')) NOT NULL DEFAULT 'not-started',
        purchased_date TEXT CHECK (purchased_date = date(purchased_date)) NOT NULL DEFAULT (date('now'))
    );
    
    CREATE TABLE IF NOT EXISTS employee_department (
        employee_id INTEGER REFERENCES employee(id),
        department INTEGER REFERENCES department(name),
        PRIMARY KEY (employee_id, department)
    );
`)

export default db;