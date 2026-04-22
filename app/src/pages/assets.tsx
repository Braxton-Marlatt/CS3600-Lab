import { useState } from 'react'
import { Link } from 'react-router-dom'

type Asset = {
  id: string
  name: string
  category: string
  location: string
  assignedTo: string
  status: 'Active' | 'In Repair' | 'Retired'
  purchaseDate: string
}

const initialAssets: Asset[] = [
  { id: 'A-1001', name: 'Dell Optiplex 7090', category: 'Desktop', location: 'Main Office', assignedTo: 'John Smith', status: 'Active', purchaseDate: '01/15/2024' },
  { id: 'A-1002', name: 'MacBook Pro 14"', category: 'Laptop', location: 'Lab 101', assignedTo: 'Sarah Johnson', status: 'Active', purchaseDate: '02/20/2024' },
  { id: 'A-1003', name: 'HP ProDesk 400', category: 'Desktop', location: 'Lab 202', assignedTo: 'Mike Davis', status: 'In Repair', purchaseDate: '03/05/2024' },
  { id: 'A-1004', name: 'Dell UltraSharp 24"', category: 'Monitor', location: 'Main Office', assignedTo: 'John Smith', status: 'Active', purchaseDate: '01/15/2024' },
  { id: 'A-1005', name: 'Cisco Switch SG350', category: 'Networking', location: 'Server Room', assignedTo: 'IT Department', status: 'Active', purchaseDate: '06/10/2023' },
  { id: 'A-1006', name: 'HP LaserJet 400', category: 'Printer', location: 'Main Office', assignedTo: 'Shared', status: 'Retired', purchaseDate: '11/22/2022' },
  { id: 'A-1007', name: 'Lenovo ThinkPad T14', category: 'Laptop', location: 'Main Office', assignedTo: 'Emily Chen', status: 'Active', purchaseDate: '04/18/2025' },
  { id: 'A-1008', name: 'Logitech Webcam C920', category: 'Peripheral', location: 'Lab 101', assignedTo: 'Lab Equipment', status: 'In Repair', purchaseDate: '08/30/2024' },
  { id: 'A-1009', name: 'Samsung 32" Curved', category: 'Monitor', location: 'Lab 202', assignedTo: 'Lab Equipment', status: 'Active', purchaseDate: '07/14/2025' },
  { id: 'A-1010', name: 'APC UPS 1500VA', category: 'Networking', location: 'Server Room', assignedTo: 'IT Department', status: 'Active', purchaseDate: '09/02/2023' },
]

const CATEGORIES = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Networking', 'Peripheral']
const STATUSES = ['Active', 'In Repair', 'Retired']

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'Active'
      ? 'bg-green-100 text-green-800'
      : status === 'In Repair'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800'
  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${cls}`}>{status}</span>
}

export default function Assets() {
  const [assets, setAssets] = useState(initialAssets)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<Asset | null>(null)

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.assignedTo.toLowerCase().includes(search.toLowerCase())
    const matchCat = !category || a.category === category
    const matchStatus = !status || a.status === status
    return matchSearch && matchCat && matchStatus
  })

  const remove = (id: string) => {
    if (confirm('Delete this asset?')) setAssets(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">All Assets</h2>
      <p className="text-gray-500 mt-1">Browse and manage all IT assets</p>
      <hr className="my-4 border-gray-200" />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <Link
          to="/add-asset"
          className="ml-auto bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800 text-white text-xs uppercase">
              <tr>
                {['Asset ID', 'Name', 'Category', 'Location', 'Assigned To', 'Status', 'Purchase Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3 font-medium">{a.id}</td>
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3">{a.category}</td>
                  <td className="px-4 py-3">{a.location}</td>
                  <td className="px-4 py-3">{a.assignedTo}</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3 text-gray-500">{a.purchaseDate}</td>
                  <td className="px-4 py-3 flex gap-1">
                    <button
                      onClick={() => setSelected(a)}
                      className="text-xs border border-blue-400 text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      View
                    </button>
                    <button className="text-xs border border-gray-400 text-gray-600 px-2 py-1 rounded hover:bg-gray-50">
                      Edit
                    </button>
                    <button
                      onClick={() => remove(a.id)}
                      className="text-xs border border-red-400 text-red-600 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">No assets match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h5 className="font-semibold text-gray-800">Asset Details</h5>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-4">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    ['Asset ID', selected.id],
                    ['Name', selected.name],
                    ['Category', selected.category],
                    ['Location', selected.location],
                    ['Assigned To', selected.assignedTo],
                    ['Status', selected.status],
                    ['Purchase Date', selected.purchaseDate],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-100 last:border-0">
                      <th className="py-2 pr-4 text-left font-medium text-gray-600 w-32">{k}:</th>
                      <td className="py-2 text-gray-800">{k === 'Status' ? <StatusBadge status={v} /> : v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">Close</button>
              <button className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">Edit Asset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}