import { Link } from 'react-router-dom'

const recentAssets = [
  { id: 'A-1047', name: 'Dell Latitude 5540', category: 'Laptop', status: 'Active', date: '03/15/2026' },
  { id: 'A-1046', name: 'HP LaserJet Pro M404', category: 'Printer', status: 'Active', date: '03/14/2026' },
  { id: 'A-1045', name: 'Cisco Catalyst 2960', category: 'Networking', status: 'In Repair', date: '03/12/2026' },
  { id: 'A-1044', name: 'Samsung 27" Monitor', category: 'Monitor', status: 'Active', date: '03/10/2026' },
  { id: 'A-1043', name: 'Logitech MX Keys', category: 'Peripheral', status: 'Active', date: '03/09/2026' },
]

const deptAssets = [
  { dept: 'IT', count: 42 },
  { dept: 'Operations', count: 22 },
  { dept: 'Marketing', count: 18 },
  { dept: 'Finance', count: 15 },
  { dept: 'HR', count: 12 },
]

const recentAssignments = [
  { name: 'John Smith', dept: 'IT', assets: 3 },
  { name: 'Mike Davis', dept: 'IT', assets: 4 },
  { name: 'Sarah Johnson', dept: 'Marketing', assets: 2 },
  { name: 'Lisa Martinez', dept: 'Operations', assets: 2 },
  { name: 'David Wilson', dept: 'HR', assets: 2 },
]

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'Active'
      ? 'bg-green-100 text-green-800'
      : status === 'In Repair'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800'
  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${cls}`}>{status}</span>
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <p className="text-gray-500 mt-1">Overview of all IT assets in the system</p>
      <hr className="my-4 border-gray-200" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg p-4 bg-blue-600 text-white shadow-sm">
          <p className="text-sm font-medium">Total Assets</p>
          <p className="text-4xl font-bold mt-1">147</p>
        </div>
        <div className="rounded-lg p-4 bg-green-600 text-white shadow-sm">
          <p className="text-sm font-medium">Active</p>
          <p className="text-4xl font-bold mt-1">112</p>
        </div>
        <div className="rounded-lg p-4 bg-yellow-500 text-white shadow-sm">
          <p className="text-sm font-medium">In Repair</p>
          <p className="text-4xl font-bold mt-1">18</p>
        </div>
        <div className="rounded-lg p-4 bg-red-600 text-white shadow-sm">
          <p className="text-sm font-medium">Retired</p>
          <p className="text-4xl font-bold mt-1">17</p>
        </div>
      </div>

      {/* Recent assets table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-4 py-3 border-b border-gray-200">
          <h5 className="font-semibold text-gray-700">Recently Added Assets</h5>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
              <tr>
                {['Asset ID', 'Name', 'Category', 'Status', 'Date Added'].map(h => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentAssets.map((a, i) => (
                <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">{a.id}</td>
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3">{a.category}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{a.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Assets by Department</span>
            <Link to="/departments" className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
              Manage
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {deptAssets.map(({ dept, count }) => (
              <li key={dept} className="flex justify-between items-center px-4 py-2.5 text-sm">
                <span>{dept}</span>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Recent Employee Assignments</span>
            <Link to="/employees" className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
              View All
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentAssignments.map(({ name, dept, assets }) => (
              <li key={name} className="flex justify-between items-center px-4 py-2.5 text-sm">
                <span>{name} <span className="text-gray-400 text-xs">({dept})</span></span>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded">{assets} assets</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}