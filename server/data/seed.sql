PRAGMA foreign_keys = ON;

-- Departments first (manager set to NULL to break circular dependency with employee)
INSERT INTO department (name, manager, location, budget) VALUES
  ('IT',         NULL, 'Server Room', 45000),
  ('HR',         NULL, 'Main Office', 8500),
  ('Finance',    NULL, 'Main Office', 12000),
  ('Marketing',  NULL, 'Main Office', 15000),
  ('Operations', NULL, 'Lab 101',     20000);

-- Employees (AUTOINCREMENT: John=1, Sarah=2, Mike=3, Emily=4, David=5, Lisa=6, James=7)
INSERT INTO employee (name, email, job_title, phone, assets) VALUES
  ('John Smith',    'jsmith@company.com','System Admin',       '(555) 234-5678', 3),
  ('Sarah Johnson',  'sjohnson@company.com', 'Marketing Lead',     '',               2),
  ('Mike Davis',    'mdavis@company.com',         'Network Engineer',   '',               4),
  ('Emily Chen',     'echen@company.com',    'Accountant',         '',               1),
  ('David Wilson',   'dwilson@company.com',         'HR Coordinator',     '',               2),
  ('Lisa Martinez', 'lmartinez@company.com', 'Operations Manager', '',               2),
  ('James Brown',    'jbrown@company.com',         'Help Desk Tech',     '',               1);

-- Wire up department managers now that employees exist
INSERT INTO employee_department (employee_id, department) VALUES
    (3, 'IT'),
    (5, 'HR'),
    (4, 'Finance'),
    (2, 'Marketing'),
    (6, 'Operations');


-- Assets
-- Status mapping: Active -> 'not-started', In Repair -> 'in-repair', Retired -> 'finished'
-- assigned_to_employee uses integer employee id; department-owned assets use assigned_to_department
INSERT INTO asset (id, name, category, location, assigned_to_employee, assigned_to_department, status, purchased_date) VALUES
  ('A-1001', 'Dell Optiplex 7090',   'Desktop',    'Main Office', 1,    NULL,         'not-started', '2024-01-15'),
  ('A-1002', 'MacBook Pro 14"',      'Laptop',     'Lab 101',     2,    NULL,         'not-started', '2024-02-20'),
  ('A-1003', 'HP ProDesk 400',       'Desktop',    'Lab 202',     3,    NULL,         'in-repair',   '2024-03-05'),
  ('A-1004', 'Dell UltraSharp 24"',  'Monitor',    'Main Office', 1,    NULL,         'not-started', '2024-01-15'),
  ('A-1005', 'Cisco Switch SG350',   'Networking', 'Server Room', NULL, 'IT',         'not-started', '2023-06-10'),
  ('A-1006', 'HP LaserJet 400',      'Printer',    'Main Office', NULL, NULL,         'finished',    '2022-11-22'),
  ('A-1007', 'Lenovo ThinkPad T14',  'Laptop',     'Main Office', 4,    NULL,         'not-started', '2025-04-18'),
  ('A-1008', 'Logitech Webcam C920', 'Peripheral', 'Lab 101',     NULL, NULL,         'in-repair',   '2024-08-30'),
  ('A-1009', 'Samsung 32" Curved',   'Monitor',    'Lab 202',     NULL, NULL,         'not-started', '2025-07-14'),
  ('A-1010', 'APC UPS 1500VA',       'Networking', 'Server Room', NULL, 'IT',         'not-started', '2023-09-02');