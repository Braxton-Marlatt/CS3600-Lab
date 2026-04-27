import express, {Application, NextFunction, Request, Response} from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import db from "./db";

// --- Configuration
const app: Application = express()

// CORS must be before everything, including the better-auth handler
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Prepared database queries
const departmentQuery = db.prepare(`SELECT
    D.name                                                               AS name,
    E.name                                                               AS manager,
    D.location                                                           AS location,
    (SELECT COUNT(*) FROM employee_department WHERE department = D.name) AS employees,
    (SELECT COUNT(*) FROM asset WHERE assigned_to_department = D.name)   AS totalAssets,
    D.budget                                                             AS budget,
    (SELECT json_group_array(json_object('name', EE.name, 'title', EE.job_title))
     FROM employee_department AS ED2
     INNER JOIN employee AS EE ON ED2.employee_id = EE.id
     WHERE ED2.department = D.name)                                      AS employeeList,
    (SELECT json_group_array(json_object('name', name, 'id', id))
     FROM asset
     WHERE assigned_to_department = D.name)                              AS assetList
FROM department AS D
LEFT JOIN employee AS E ON D.manager = E.id
`);

const employeeId = db.prepare(`SELECT id
                               FROM employee
                               WHERE name = ?`)
const addDepartment = db.prepare(`INSERT INTO department (name, manager, location, budget)
                                  VALUES (?, ?, ?, ?)`)
const add_DE_Relation = db.prepare(`INSERT INTO employee_department (employee_id, department)
                                    VALUES (?, ?)`)
const addDepartmentTransaction = db.transaction((managerId: number | null, name: string, location: string, budget: string) => {
  addDepartment.run(name, managerId, location, budget);
  if (managerId !== null) add_DE_Relation.run(managerId, name);
})
const departmentNames = db.prepare(`SELECT name
                                    FROM department`);
const employeesQuery = db.prepare(`SELECT E.id                                AS id,
                                          E.name                              AS name,
                                          E.email                             AS email,
                                          D.name                              AS department,
                                          E.job_title                         AS jobTitle,
                                          E.phone                             AS phone,
                                          (SELECT COUNT(*)
                                           FROM asset AS A
                                           WHERE assigned_to_employee = E.id) AS assetCount,
                                          (SELECT json_group_array(json_object('name', name, 'id', id))
                                           FROM asset
                                           WHERE assigned_to_employee = E.id) AS assetList
                                   FROM employee AS E
                                            LEFT JOIN employee_department AS ED ON E.id = ED.employee_id
                                            LEFT JOIN department AS D ON ED.department = D.name
`)

const addEmployee = db.prepare(`INSERT INTO employee (name, email, job_title, phone) VALUES (?, ?, ?, ?)`)
const addEmployeeTransaction = db.transaction((name: string, email: string, jobTitle: string, phone: string, department: string) => {
  const res = addEmployee.run(name, email,jobTitle, phone) as {changes: number, lastInsertRowid: number};
  if (res.lastInsertRowid !== null) add_DE_Relation.run(res.lastInsertRowid, department)
  return res.lastInsertRowid;
})

const getAssets = db.prepare(`SELECT
    A.id                       AS id,
    A.name                     AS name,
    A.serial_number            AS serialNumber,
    A.category                 AS category,
    A.location                 AS location,
    A.status                   AS status,
    A.purchased_date           AS purchaseDate,
    A.price                    AS price,
    A.warranty_expiration      AS warrantyExpiration,
    A.manufacturer             AS manufacturer,
    A.model                    AS model,
    A.notes                    AS notes,
    A.assigned_to_department   AS assignedDepartment,
    A.assigned_to_employee     AS assignedEmployeeId,
    E.name                     AS assignedEmployee
FROM asset AS A LEFT JOIN employee AS E ON E.id = A.assigned_to_employee
`)

const getMaxAssetId = db.prepare(`SELECT MAX(CAST(SUBSTR(id, 3) AS INTEGER)) AS maxId FROM asset`)

const addAssetStmt = db.prepare(`INSERT INTO asset
    (id, name, serial_number, category, location, status, purchased_date, price, warranty_expiration, manufacturer, model, notes, assigned_to_employee, assigned_to_department)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)

const updateAssetStmt = db.prepare(`UPDATE asset SET
    name=?, serial_number=?, category=?, location=?, status=?, purchased_date=?,
    price=?, warranty_expiration=?, manufacturer=?, model=?, notes=?,
    assigned_to_employee=?, assigned_to_department=?
    WHERE id=?`)

const deleteAssetStmt = db.prepare(`DELETE FROM asset WHERE id=?`)

const removeEmployeeRelations = db.prepare(`DELETE FROM employee_department WHERE employee_id=?`)
const unassignEmployeeAssets = db.prepare(`UPDATE asset SET assigned_to_employee=NULL WHERE assigned_to_employee=?`)
const clearEmployeeManagerRoles = db.prepare(`UPDATE department SET manager=NULL WHERE manager=?`)
const deleteEmployeeStmt = db.prepare(`DELETE FROM employee WHERE id=?`)
const deleteEmployeeTransaction = db.transaction((id: number) => {
  removeEmployeeRelations.run(id)
  unassignEmployeeAssets.run(id)
  clearEmployeeManagerRoles.run(id)
  deleteEmployeeStmt.run(id)
})

const setDeptManager = db.prepare(`UPDATE department SET manager=? WHERE name=?`)

const removeDeptEmployeeRelations = db.prepare(`DELETE FROM employee_department WHERE department=?`)
const unassignDeptAssets = db.prepare(`UPDATE asset SET assigned_to_department=NULL WHERE assigned_to_department=?`)
const deleteDeptStmt = db.prepare(`DELETE FROM department WHERE name=?`)
const deleteDeptTransaction = db.transaction((name: string) => {
  removeDeptEmployeeRelations.run(name)
  unassignDeptAssets.run(name)
  deleteDeptStmt.run(name)
})

const dashboardStats = db.prepare(`SELECT
    COUNT(*)                                                        AS totalAssets,
    SUM(CASE WHEN status = 'not-started' THEN 1 ELSE 0 END)        AS active,
    SUM(CASE WHEN status = 'in-repair'   THEN 1 ELSE 0 END)        AS inRepair,
    SUM(CASE WHEN status = 'finished'    THEN 1 ELSE 0 END)        AS retired
FROM asset`)

const dashboardDeptAssets = db.prepare(`SELECT D.name AS dept,
    (SELECT COUNT(*) FROM asset WHERE assigned_to_department = D.name) +
    (SELECT COUNT(*) FROM asset AS A
        INNER JOIN employee_department AS ED ON A.assigned_to_employee = ED.employee_id
        WHERE ED.department = D.name) AS count
FROM department AS D
ORDER BY count DESC
LIMIT 5`)

const dashboardRecentAssets = db.prepare(`SELECT id, name, category, status, purchased_date AS date
FROM asset
ORDER BY purchased_date DESC
LIMIT 5`)

const dashboardRecentAssignments = db.prepare(`SELECT E.name,
    D.name AS dept,
    (SELECT COUNT(*) FROM asset WHERE assigned_to_employee = E.id) AS assets
FROM employee AS E
LEFT JOIN employee_department AS ED ON E.id = ED.employee_id
LEFT JOIN department AS D ON ED.department = D.name
ORDER BY assets DESC
LIMIT 5`)

// API routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({status: "ok"});
});

app.get("/api/dashboard", (_req: Request, res: Response) => {
  try {
    const stats = dashboardStats.get()
    const deptAssets = dashboardDeptAssets.all()
    const recentAssets = dashboardRecentAssets.all()
    const recentAssignments = dashboardRecentAssignments.all()
    res.status(200).json({data: {stats, deptAssets, recentAssets, recentAssignments}})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"})
  }
})

app.get("/api/assets", (_req: Request, res: Response) => {
  try {
    const results = getAssets.all()
    res.status(200).json({data: results})
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"});
  }
})

app.post("/api/assets", (_req: Request, res: Response) => {
  const {name, serialNumber, category, location, status, purchaseDate, price, warrantyExpiration, manufacturer, model, notes, assignedEmployeeId, assignedDepartment} = _req.body
  try {
    const {maxId} = getMaxAssetId.get() as {maxId: number | null}
    const nextId = `A-${((maxId ?? 999) + 1).toString().padStart(4, '0')}`
    addAssetStmt.run(
      nextId, name, serialNumber ?? '', category, location, status,
      purchaseDate || new Date().toISOString().split('T')[0],
      price ?? 0, warrantyExpiration ?? '', manufacturer ?? '', model ?? '', notes ?? '',
      assignedEmployeeId || null, assignedDepartment || null
    )
    res.status(200).json({data: {id: nextId}})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"})
  }
})

app.put("/api/assets/:id", (_req: Request, res: Response) => {
  const {id} = _req.params
  const {name, serialNumber, category, location, status, purchaseDate, price, warrantyExpiration, manufacturer, model, notes, assignedEmployeeId, assignedDepartment} = _req.body
  try {
    const result = updateAssetStmt.run(
      name, serialNumber ?? '', category, location, status,
      purchaseDate, price ?? 0, warrantyExpiration ?? '', manufacturer ?? '', model ?? '', notes ?? '',
      assignedEmployeeId || null, assignedDepartment || null,
      id
    ) as {changes: number}
    if (result.changes === 0) {
      res.status(404).json({error: 'Asset not found'})
      return
    }
    res.status(200).json({data: {id}})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"})
  }
})

app.delete("/api/assets/:id", (_req: Request, res: Response) => {
  const {id} = _req.params
  try {
    const result = deleteAssetStmt.run(id) as {changes: number}
    if (result.changes === 0) {
      res.status(404).json({error: 'Asset not found'})
      return
    }
    res.status(200).json({data: {id}})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"})
  }
})

app.get("/api/departments", async (_req: Request, res: Response) => {
  try {
    const results = departmentQuery.all()
    res.status(200).json({data: results});
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"});
  }
})

app.post("/api/departments", async (_req: Request, res: Response) => {
  const {name, manager, location, budget} = _req.body;
  try {
    const id = employeeId.get(manager) as { id: number } | undefined;
    if (manager && !id) {
      res.status(400).json({error: `Employee '${manager}' not found`});
      return;
    }
    const managerId = id?.id ?? null;
    const result = addDepartmentTransaction(managerId, name, location, budget)
    res.status(200).json({data: result});
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"});
  }
})

app.put("/api/departments/:name/manager", (_req: Request, res: Response) => {
  const name = _req.params.name as string
  const {manager} = _req.body
  try {
    const emp = employeeId.get(manager) as {id: number} | undefined
    if (manager && !emp) {
      res.status(400).json({error: `Employee '${manager}' not found`})
      return
    }
    setDeptManager.run(emp?.id ?? null, name)
    res.status(200).json({data: {name}})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"})
  }
})

app.delete("/api/departments/:name", (_req: Request, res: Response) => {
  const name = _req.params.name as string
  try {
    deleteDeptTransaction(name)
    res.status(200).json({data: {name}})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"})
  }
})

app.get("/api/get-department-names", async (_req: Request, res: Response) => {
  try {
    const results = departmentNames.all()
    res.status(200).json({data: results});
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"});
  }
})

app.post("/api/assign-department", async (_req: Request, res: Response) => {
  const {employeeId, department} = _req.body;
  if (!employeeId || !department) {
    res.status(400).json({error: `Employee and/or department not provided`});
  }
  try {
    const results = add_DE_Relation.run(employeeId, department)
    res.status(200).json({data: results});
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"});
  }

})

app.delete("/api/employees/:id", (_req: Request, res: Response) => {
  const id = Number(_req.params.id)
  try {
    deleteEmployeeTransaction(id)
    res.status(200).json({data: {id}})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"})
  }
})

app.get("/api/employees", async (_req: Request, res: Response) => {
  try {
    const results = employeesQuery.all()
    res.status(200).json({data: results});
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"});
  }
})

app.post("/api/employee", async (_req: Request, res: Response) => {
  const {name, email, jobTitle, phone, department} = _req.body;
  try {
    const results = addEmployeeTransaction(name, email, jobTitle, phone, department);
    res.status(200).json({data: results});
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error instanceof Error ? error.message : "Internal server error"});
  }
})

// Serve React app in production
const publicDir = path.join(__dirname, "../../public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get(/^(?!\/api).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

// Catch all and error routes (has to be at the end)
app.use((_req: Request, res: Response) => {
  res.status(404).json({error: "Not Found"});
})

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({error: err.message || "Internal Server Error"});
})

export default app;
