import { useState } from 'react'
import type { FormEvent } from 'react'

type Department = {
  name: string
  manager: string
  location: string
  employees: number
  totalAssets: number
  budget: string
}

const initialDepts: Department[] = [
  { name: 'IT', manager: 'Mike Davis', location: 'Server Room', employees: 3, totalAssets: 42, budget: '$45,000' },
  { name: 'HR', manager: 'David Wilson', location: 'Main Office', employees: 1, totalAssets: 12, budget: '$8,500' },
  { name: 'Finance', manager: 'Emily Chen', location: 'Main Office', employees: 1, totalAssets: 15, budget: '$12,000' },
  { name: 'Marketing', manager: 'Sarah Johnson', location: 'Main Office', employees: 1, totalAssets: 18, budget: '$15,000' },
  { name: 'Operations', manager: 'Lisa Martinez', location: 'Lab 101', employees: 1, totalAssets: 22, budget: '$20,000' },
]

const LOCATIONS = ['Main Office', 'Server Room', 'Lab 101', 'Lab 202']

export default function Departments() {
  const [depts, setDepts] = useState(initialDepts)
  const [selected, setSelected] = useState<Department | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = e.target as HTMLFormElement
    const get = (id: string) => (f.elements.namedItem(id) as HTMLInputElement).value
    const budget = get('deptBudget')
    setDepts(prev => [...prev, {
      name: get('deptName'),
      manager: get('deptManager') || '-',
      location: get('deptLocation') || '-',
      employees: 0,
      totalAssets: 0,
      budget: budget ? '$' + Number(budget).toLocaleString() : '$0',
    }])
    f.reset()
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const remove = (name: string) => {
    if (confirm('Are you sure you want to delete this department? All employees will need to be reassigned.'))
      setDepts(prev => prev.filter(d => d.name !== name))
  }

  const totalEmployees = depts.reduce((s, d) => s + d.employees, 0)
  const totalBudgetRaw = depts.reduce((s, d) => s + Number(d.budget.replace(/[$,]/g, '')), 0)
  const totalBudgetDisplay = (totalBudgetRaw / 1000).toFixed(1) + 'K'

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">Departments</h2>
      <p className="text-gray-500 mt-1">Manage departments for organizing employees and assets</p>
      <hr className="my-4 border-gray-200" />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Add form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h5 className="font-semibold text-gray-700">Add New Department</h5>
          </div>
          <div className="px-4 py-4">
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label htmlFor="deptName" className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                <input id="deptName" name="deptName" type="text" required placeholder="e.g. Engineering"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="deptManager" className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                <input id="deptManager" name="deptManager" type="text" placeholder="Department manager name"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="deptLocation" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select id="deptLocation" name="deptLocation"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Location --</option>
                  {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="deptBudget" className="block text-sm font-medium text-gray-700 mb-1">IT Budget ($)</label>
                <input id="deptBudget" name="deptBudget" type="number" step="0.01" placeholder="0.00"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="deptDesc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea id="deptDesc" name="deptDesc" rows={2} placeholder="Brief description..."
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                  {depts.map(dept => (
                    <tr key={dept.name} className="border-t border-gray-100 hover:bg-gray-50">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h5 className="font-semibold text-gray-800">Department Details</h5>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
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
                <li className="flex justify-between px-3 py-2">John Smith <span className="text-gray-400">System Admin</span></li>
                <li className="flex justify-between px-3 py-2">Mike Davis <span className="text-gray-400">Network Engineer</span></li>
                <li className="flex justify-between px-3 py-2">James Brown <span className="text-gray-400">Help Desk Tech</span></li>
              </ul>
              <h6 className="font-semibold text-gray-700 mb-2">Department Assets (Top 5)</h6>
              <ul className="border border-gray-200 rounded divide-y divide-gray-100 text-sm">
                <li className="flex justify-between px-3 py-2">Dell Optiplex 7090 <span className="text-gray-400">A-1001</span></li>
                <li className="flex justify-between px-3 py-2">Cisco Switch SG350 <span className="text-gray-400">A-1005</span></li>
                <li className="flex justify-between px-3 py-2">APC UPS 1500VA <span className="text-gray-400">A-1010</span></li>
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