import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

type DashboardData = {
  stats: {totalAssets: number, active: number, inRepair: number, retired: number}
  deptAssets: {dept: string, count: number}[]
  recentAssets: {id: string, name: string, category: string, status: string, date: string}[]
  recentAssignments: {name: string, dept: string, assets: number}[]
}

const STATUS_LABEL: Record<string, string> = {
  'not-started': 'Active',
  'in-repair': 'In Repair',
  'finished': 'Retired',
}

function StatusBadge({status}: { status: string }) {
  const cls =
    status === 'not-started'
      ? 'bg-green-100 text-green-800'
      : status === 'in-repair'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800'
  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${cls}`}>{STATUS_LABEL[status] ?? status}</span>
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard`)
      .then(res => res.json())
      .then(res => setData(res.data))
  }, [])

  const stats = data?.stats
  const deptAssets = data?.deptAssets ?? []
  const recentAssets = data?.recentAssets ?? []
  const recentAssignments = data?.recentAssignments ?? []

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
      <p className="text-gray-500 mt-1">Overview of all IT assets in the system</p>
      <hr className="my-4 border-gray-200"/>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-lg p-4 bg-blue-600 text-white shadow-sm">
          <p className="text-sm font-medium">Total Assets</p>
          <p className="text-4xl font-bold mt-1">{stats?.totalAssets ?? '—'}</p>
        </div>
        <div className="rounded-lg p-4 bg-green-600 text-white shadow-sm">
          <p className="text-sm font-medium">Active</p>
          <p className="text-4xl font-bold mt-1">{stats?.active ?? '—'}</p>
        </div>
        <div className="rounded-lg p-4 bg-yellow-500 text-white shadow-sm">
          <p className="text-sm font-medium">In Repair</p>
          <p className="text-4xl font-bold mt-1">{stats?.inRepair ?? '—'}</p>
        </div>
        <div className="rounded-lg p-4 bg-red-600 text-white shadow-sm">
          <p className="text-sm font-medium">Retired</p>
          <p className="text-4xl font-bold mt-1">{stats?.retired ?? '—'}</p>
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
                <td className="px-4 py-3"><StatusBadge status={a.status}/></td>
                <td className="px-4 py-3 text-gray-500">{a.date}</td>
              </tr>
            ))}
            {recentAssets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No assets yet.</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Assets by Department</span>
            <Link to="/departments"
                  className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
              Manage
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {deptAssets.map(({dept, count}) => (
              <li key={dept} className="flex justify-between items-center px-4 py-2.5 text-sm">
                <span>{dept}</span>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded">{count}</span>
              </li>
            ))}
            {deptAssets.length === 0 && (
              <li className="px-4 py-4 text-center text-gray-400 text-sm">No data yet.</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Top Employee Assignments</span>
            <Link to="/employees"
                  className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
              View All
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {recentAssignments.map(({name, dept, assets}) => (
              <li key={name} className="flex justify-between items-center px-4 py-2.5 text-sm">
                <span>{name} <span className="text-gray-400 text-xs">({dept})</span></span>
                <span
                  className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-0.5 rounded">{assets} assets</span>
              </li>
            ))}
            {recentAssignments.length === 0 && (
              <li className="px-4 py-4 text-center text-gray-400 text-sm">No data yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
