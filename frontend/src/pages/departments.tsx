import {useEffect, useState} from 'react'

type Department = {
  name: string
  manager: string
  location: string
  employees: number
  employeeList: {
    name: string,
    title: string
  }[]
  assetList: {
    name: string,
    id: string,
  }[]
  totalAssets: number
  budget: number
}

const LOCATIONS = ['Main Office', 'Server Room', 'Lab 101', 'Lab 202']

export default function Departments() {
  const [depts, setDepts] = useState<Department[]>([])
  const [selected, setSelected] = useState<Department | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, {
      method: 'GET'
    }).then(res => res.json()).then(res => setDepts(res.data.map((d: any) => ({
      ...d,
      employeeList: d.employeeList ? JSON.parse(d.employeeList) : [],
      assetList: d.assetList ? JSON.parse(d.assetList) : [],
    }))))
  }, [])

  const handleAdd = async (e: any) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    setDepts(prev => [...prev, {
      name: formData.get('name') as string,
      manager: (formData.get('manager') as string) || '-',
      location: (formData.get('location') as string) || '-',
      employees: 0,
      totalAssets: 0,
      employeeList: [],
      assetList: [],
      budget: Number(formData.get('budget')),
    }])

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name') as string,
        manager: formData.get('manager') as string,
        location: formData.get('location') as string,
        budget: Number(formData.get('budget')),
      }),
    });

    if (response.ok) {
      e.target.reset()
      setShowSuccess(true)
    }

    setTimeout(() => setShowSuccess(false), 3000)
  }

  const remove = (name: string) => {
    if (confirm('Are you sure you want to delete this department? All employees will need to be reassigned.'))
      setDepts(prev => prev.filter(d => d.name !== name))
  }

  const totalEmployees = depts.reduce((s, d) => s + d.employees, 0)
  const totalBudgetRaw = depts.reduce((s, d) => s + Number(String(d.budget).replace(/[$,]/g, '')), 0)
  const totalBudgetDisplay = (totalBudgetRaw / 1000).toFixed(1) + 'K'

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">Departments</h2>
      <p className="text-gray-500 mt-1">Manage departments for organizing employees and assets</p>
      <hr className="my-4 border-gray-200"/>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h5 className="font-semibold text-gray-700">Add New Department</h5>
          </div>
          <div className="px-4 py-4">
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name *
                </label>
                <input id="name" name="name" type="text" required placeholder="e.g. Engineering"
                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                <input id="manager" name="manager" type="text" placeholder="Department manager name"
                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select id="location" name="location"
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Location --</option>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  IT Budget ($)
                </label>
                <input id="budget" name="budget" type="number" step="0.01" placeholder="0.00"
                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <div>
                <label htmlFor="deptDesc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="deptDesc" name="deptDesc" rows={2} placeholder="Brief description..."
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700">
                Add Department
              </button>
            </form>
            {showSuccess && (
              <div className="mt-3 bg-green-50 border border-green-300 text-green-800 text-sm px-3 py-2 rounded">
                Department added successfully!
              </div>
            )}
          </div>
        </div>

        {/* Table + summary */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h5 className="font-semibold text-gray-700">All Departments</h5>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-800 text-white text-xs uppercase">
                <tr>
                  {['Department', 'Manager', 'Location', 'Employees', 'Total Assets', 'IT Budget', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
                </thead>
                <tbody>
                {depts.map((dept, i) => (
                  <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{dept.name}</td>
                    <td className="px-4 py-3">{dept.manager}</td>
                    <td className="px-4 py-3">{dept.location}</td>
                    <td className="px-4 py-3">{dept.employees}</td>
                    <td className="px-4 py-3">{dept.totalAssets}</td>
                    <td className="px-4 py-3">{dept.budget}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <button
                        onClick={() => setSelected(dept)}
                        className="text-xs border border-blue-400 text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() => remove(dept.name)}
                        className="text-xs border border-red-400 text-red-600 px-2 py-1 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Budget summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h5 className="font-semibold text-gray-700">Budget Summary</h5>
            </div>
            <div className="grid grid-cols-3 text-center py-4 divide-x divide-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Departments</p>
                <p className="text-3xl font-bold text-gray-800">{depts.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Employees</p>
                <p className="text-3xl font-bold text-gray-800">{totalEmployees}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total IT Budget</p>
                <p className="text-3xl font-bold text-gray-800">${totalBudgetDisplay}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
             onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h5 className="font-semibold text-gray-800">Department Details</h5>
              <button onClick={() => setSelected(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-4">
              <table className="w-full text-sm mb-4">
                <tbody>
                {[
                  ['Department', selected.name],
                  ['Manager', selected.manager],
                  ['Location', selected.location],
                  ['IT Budget', selected.budget],
                  ['Description', 'Manages all technology infrastructure, hardware, and software systems'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100 last:border-0">
                    <th className="py-2 pr-4 text-left font-medium text-gray-600 w-28">{k}:</th>
                    <td className="py-2 text-gray-800">{v}</td>
                  </tr>
                ))}
                </tbody>
              </table>
              <h6 className="font-semibold text-gray-700 mb-2">Department Employees</h6>
              <ul className="border border-gray-200 rounded divide-y divide-gray-100 text-sm mb-4">
                {selected.employeeList.map((employee, i) => (
                  <li key={i} className="flex justify-between px-3 py-2">
                    {employee.name} <span className="text-gray-400">{employee.title}</span>
                  </li>
                ))}
              </ul>
              <h6 className="font-semibold text-gray-700 mb-2">Department Assets (Top 5)</h6>
              {selected.assetList.length > 0 ? (

                <ul className="border border-gray-200 rounded divide-y divide-gray-100 text-sm">
                  {selected.assetList.map((item, i) => {
                    if (i < 5) { // show only 5 results
                      return (
                        <li key={i} className="flex justify-between px-3 py-2">
                          {item.name}<span className="text-gray-400">{item.id}</span>
                        </li>
                      )
                    }
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">No assets in this department</p>
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