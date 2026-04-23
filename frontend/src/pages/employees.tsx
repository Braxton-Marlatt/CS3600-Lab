import { useState } from 'react'
import type { FormEvent } from 'react'

type Employee = {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  jobTitle: string
  phone: string
  assets: number
}

const initialEmployees: Employee[] = [
  { id: 'E-001', firstName: 'John', lastName: 'Smith', email: 'jsmith@company.com', department: 'IT', jobTitle: 'System Admin', phone: '(555) 234-5678', assets: 3 },
  { id: 'E-002', firstName: 'Sarah', lastName: 'Johnson', email: 'sjohnson@company.com', department: 'Marketing', jobTitle: 'Marketing Lead', phone: '', assets: 2 },
  { id: 'E-003', firstName: 'Mike', lastName: 'Davis', email: 'mdavis@company.com', department: 'IT', jobTitle: 'Network Engineer', phone: '', assets: 4 },
  { id: 'E-004', firstName: 'Emily', lastName: 'Chen', email: 'echen@company.com', department: 'Finance', jobTitle: 'Accountant', phone: '', assets: 1 },
  { id: 'E-005', firstName: 'David', lastName: 'Wilson', email: 'dwilson@company.com', department: 'HR', jobTitle: 'HR Coordinator', phone: '', assets: 2 },
  { id: 'E-006', firstName: 'Lisa', lastName: 'Martinez', email: 'lmartinez@company.com', department: 'Operations', jobTitle: 'Operations Manager', phone: '', assets: 2 },
  { id: 'E-007', firstName: 'James', lastName: 'Brown', email: 'jbrown@company.com', department: 'IT', jobTitle: 'Help Desk Tech', phone: '', assets: 1 },
]

const DEPARTMENTS = ['IT', 'HR', 'Finance', 'Marketing', 'Operations']

export default function Employees() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [counter, setCounter] = useState(7)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [selected, setSelected] = useState<Employee | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const filtered = employees.filter(e => {
    const fullName = `${e.firstName} ${e.lastName}`.toLowerCase()
    const matchSearch = !search ||
      fullName.includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.jobTitle.toLowerCase().includes(search.toLowerCase())
    const matchDept = !deptFilter || e.department === deptFilter
    return matchSearch && matchDept
  })

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.target as HTMLFormElement
    const get = (id: string) => (f.elements.namedItem(id) as HTMLInputElement).value
    const newCount = counter + 1
    setCounter(newCount)
    setEmployees(prev => [{
      id: `E-${String(newCount).padStart(3, '0')}`,
      firstName: get('empFirst'),
      lastName: get('empLast'),
      email: get('empEmail'),
      department: get('empDept'),
      jobTitle: get('empRole') || '-',
      phone: get('empPhone'),
      assets: 0,
    }, ...prev])
    f.reset()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const remove = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?'))
      setEmployees(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
      <p className="text-gray-500 mt-1">Manage employees that assets can be assigned to</p>
      <hr className="my-4 border-gray-200" />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h5 className="font-semibold text-gray-700">Add New Employee</h5>
          </div>
          <div className="px-4 py-4">
            <form onSubmit={handleAdd} className="space-y-3">
              {[
                { id: 'empFirst', label: 'First Name *', type: 'text', required: true, placeholder: 'First name' },
                { id: 'empLast', label: 'Last Name *', type: 'text', required: true, placeholder: 'Last name' },
                { id: 'empEmail', label: 'Email *', type: 'email', required: true, placeholder: 'email@company.com' },
                { id: 'empRole', label: 'Job Title', type: 'text', required: false, placeholder: 'e.g. Software Developer' },
                { id: 'empPhone', label: 'Phone', type: 'tel', required: false, placeholder: '(555) 123-4567' },
              ].map(({ id, label, type, required, placeholder }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input id={id} name={id} type={type} required={required} placeholder={placeholder}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label htmlFor="empDept" className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select id="empDept" name="empDept" required
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 mt-1">
                Add Employee
              </button>
            </form>
            {showSuccess && (
              <div className="mt-3 bg-green-50 border border-green-300 text-green-800 text-sm px-3 py-2 rounded">
                Employee added successfully!
              </div>
            )}
          </div>
        </div>

        {/* Employee list */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h5 className="font-semibold text-gray-700">All Employees</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-800 text-white text-xs uppercase">
                  <tr>
                    {['ID', 'Name', 'Email', 'Department', 'Job Title', 'Assets', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr key={emp.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{emp.id}</td>
                      <td className="px-4 py-3">{emp.firstName} {emp.lastName}</td>
                      <td className="px-4 py-3 text-gray-500">{emp.email}</td>
                      <td className="px-4 py-3">{emp.department}</td>
                      <td className="px-4 py-3">{emp.jobTitle}</td>
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded">{emp.assets}</span>
                      </td>
                      <td className="px-4 py-3 flex gap-1">
                        <button
                          onClick={() => setSelected(emp)}
                          className="text-xs border border-blue-400 text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() => remove(emp.id)}
                          className="text-xs border border-red-400 text-red-600 px-2 py-1 rounded hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No employees found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h5 className="font-semibold text-gray-800">Employee Details</h5>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-4">
              <table className="w-full text-sm mb-4">
                <tbody>
                  {[
                    ['Employee ID', selected.id],
                    ['Name', `${selected.firstName} ${selected.lastName}`],
                    ['Email', selected.email],
                    ['Phone', selected.phone || '-'],
                    ['Department', selected.department],
                    ['Job Title', selected.jobTitle],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100 last:border-0">
                      <th className="py-2 pr-4 text-left font-medium text-gray-600 w-32">{k}:</th>
                      <td className="py-2 text-gray-800">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h6 className="font-semibold text-gray-700 mb-2">Assigned Assets</h6>
              <ul className="border border-gray-200 rounded divide-y divide-gray-100 text-sm">
                <li className="flex justify-between px-3 py-2">
                  Dell Optiplex 7090 <span className="text-gray-400">A-1001</span>
                </li>
                <li className="flex justify-between px-3 py-2">
                  Dell UltraSharp 24" <span className="text-gray-400">A-1004</span>
                </li>
                <li className="flex justify-between px-3 py-2">
                  Logitech MX Keys <span className="text-gray-400">A-1043</span>
                </li>
              </ul>
            </div>
            <div className="px-5 py-3 border-t flex justify-end">
              <button onClick={() => setSelected(null)} className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}