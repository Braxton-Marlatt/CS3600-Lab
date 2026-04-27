import {useEffect, useState} from 'react'
import {IconDelete, IconEye} from "../components/icons.tsx";

type Employee = {
  id: string
  name: string
  email: string
  department: string
  jobTitle: string
  phone: string
  assetCount: number
  assetList: {
    name: string,
    id: string
  }[]
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [departments, setDepartments] = useState<string[]>([])
  const [deptFilter, setDeptFilter] = useState('')
  const [selected, setSelected] = useState<Employee | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [assignDept, setAssignDept] = useState<string | null>(null)
  const [assignSuccess, setAssignSuccess] = useState(false)
  const [assignError, setAssignError] = useState('')


  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employees`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(res => setEmployees(res.data.map((d: any) => ({
        ...d,
        assetList: d.assetList ? JSON.parse(d.assetList) : [],
      }))))
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-department-names`, {
      method: 'GET',
    }).then(res => res.json()).then(res => setDepartments(res.data.map((d: { name: string }) => d.name)))
  }, []);

  const filtered = employees.filter(e => {
    const matchSearch = !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.jobTitle.toLowerCase().includes(search.toLowerCase())
    const matchDept = !deptFilter || e.department === deptFilter
    return matchSearch && matchDept
  })

  const handleAssignDepartment = (e: any) => {
    e.preventDefault()
    if (!selected || !assignDept) return
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assign-department`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({employeeId: selected.id, department: assignDept}),
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          setAssignError(res.error)
        } else {
          setAssignSuccess(true)
          setEmployees(prev => prev.map(e =>
            e.id === selected.id ? {...e, department: assignDept} : e
          ))
          setAssignError('')
          setAssignDept(null)
        }
      })
      .catch(() => setAssignError('Request failed'))
  }

  const handleAdd = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const fields = Object.fromEntries(formData) as Record<string, string>
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employee`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(fields)
    })

    if (res.ok) {
      const json = await res.json()
      setEmployees(prev => [...prev, {
        id: String(json.data),
        name: fields.name,
        email: fields.email,
        department: fields.department,
        jobTitle: fields.jobTitle,
        phone: fields.phone,
        assetCount: 0,
        assetList: [],
      }])
      e.target.reset()
      setShowSuccess(true)
    }
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee?')) return
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employees/${id}`, {method: 'DELETE'})
    if (res.ok) setEmployees(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">Employees</h2>
      <p className="text-gray-500 mt-1">Manage employees that assets can be assigned to</p>
      <hr className="my-4 border-gray-200"/>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h5 className="font-semibold text-gray-700">Add New Employee</h5>
          </div>
          <div className="px-4 py-4">
            <form onSubmit={handleAdd} className="space-y-3">
              {[
                {id: 'name', label: 'Name *', type: 'text', required: true, placeholder: 'John Doe'},
                {id: 'email', label: 'Email *', type: 'email', required: true, placeholder: 'email@company.com'},
                {
                  id: 'jobTitle',
                  label: 'Job Title',
                  type: 'text',
                  required: false,
                  placeholder: 'e.g. Software Developer'
                },
                {id: 'phone', label: 'Phone', type: 'tel', required: false, placeholder: '(555) 123-4567'},
              ].map(({id, label, type, required, placeholder}) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input id={id} name={id} type={type} required={required} placeholder={placeholder}
                         className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              ))}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department
                  *</label>
                <select id="department" name="department" required
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Department --</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <button type="submit"
                      className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 mt-1">
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
              {departments.map(d => <option key={d}>{d}</option>)}
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
                    <td className="px-4 py-3">{emp.name}</td>
                    <td className="px-4 py-3 text-gray-500">{emp.email}</td>
                    <td className="px-4 py-3">{emp.department}</td>
                    <td className="px-4 py-3">{emp.jobTitle}</td>
                    <td className="px-4 py-3">
                      <span
                        className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded">{emp.assetCount}</span>
                    </td>
                    <td className="px-4 py-3 flex gap-1">
                      <button
                        onClick={() => setSelected(emp)}
                        className="text-xs border border-blue-400 text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        <IconEye/>
                      </button>
                      <button
                        onClick={() => remove(emp.id)}
                        className="text-xs border border-red-400 text-red-600 px-2 py-1 rounded hover:bg-red-50"
                      >
                        <IconDelete/>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
             onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h5 className="font-semibold text-gray-800">Employee Details</h5>
              <button onClick={() => setSelected(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-4">
              <table className="w-full text-sm mb-4">
                <tbody>
                {[
                  ['Employee ID', selected.id],
                  ['Name', selected.name],
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
              {selected.assetList.length > 0 ? (

                <ul className="border border-gray-200 rounded divide-y divide-gray-100 text-sm">
                  {selected.assetList.map((item, i) => (
                    <li key={i} className="flex justify-between px-3 py-2">
                      {item.name}<span className="text-gray-400">{item.id}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic text-sm">No assets owned</p>
              )}

              <hr className="my-4 border-gray-200"/>
              <h6 className="font-semibold text-gray-700 mb-2">Add to Department</h6>
              <form onSubmit={handleAssignDepartment} className="flex gap-2">
                <select
                  value={assignDept ?? selected.department}
                  onChange={e => setAssignDept(e.target.value)}
                  required
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
                <button type="submit"
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap">
                  Assign
                </button>
              </form>
              {assignSuccess && (
                <p className="mt-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-1.5">
                  Assigned to {selected.department} successfully!
                </p>
              )}
              {assignError && (
                <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-1.5">
                  {assignError}
                </p>
              )}
            </div>
            <div className="px-5 py-3 border-t flex justify-end">
              <button onClick={() => setSelected(null)}
                      className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}