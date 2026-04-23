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
const departmentQuery = db.prepare(`SELECT D.name                                                               AS name,
                                           E.name                                                               AS manager,
                                           D.location                                                           AS location,
                                           (SELECT COUNT(*) FROM employee_department WHERE department = D.name) AS employees,
                                           (SELECT COUNT(*) FROM asset WHERE assigned_to_department = D.name)   AS totalAssets,
                                           D.budget                                                             AS budget,

                                           -- EMPLOYEE LIST
                                           (SELECT json_group_array(json_object(
                                                   'name', EE.name, 'title', EE.job_title
                                                                    ))
                                            FROM employee_department AS ED2
                                                     INNER JOIN employee AS EE ON ED2.employee_id = EE.id
                                            WHERE ED2.department = D.name)                                      AS employeeList,
                                           -- ASSET LIST
                                           (SELECT json_group_array(json_object(
                                                   'name', name, 'id', id
                                                                    ))
                                            FROM asset
                                            WHERE assigned_to_department = D.name)                              AS assetList

                                    FROM employee_department AS ED
                                             INNER JOIN employee AS E ON ED.employee_id = E.id
                                             INNER JOIN department AS D ON ED.department = D.name
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

// API routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({status: "ok"});
});

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