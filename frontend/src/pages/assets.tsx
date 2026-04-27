import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {IconDead, IconDelete, IconEdit, IconExcavator, IconEye, IconShield} from "../components/icons.tsx";

type Asset = {
  id: string
  name: string
  serialNumber: string
  category: string
  location: string
  assignedEmployee: string | null
  assignedEmployeeId: number | null
  assignedDepartment: string | null
  status: 'not-started' | 'in-repair' | 'finished'
  purchaseDate: string
  price: number
  warrantyExpiration: string
  manufacturer: string
  model: string
  notes: string
}

const CATEGORIES = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Networking', 'Peripheral', 'Server', 'Other']
const LOCATIONS = ['Main Office', 'Server Room', 'Lab 101', 'Lab 202', 'Storage']
const STATUSES = [
  {value: 'not-started', label: 'Active'},
  {value: 'in-repair', label: 'In Repair'},
  {value: 'finished', label: 'Retired'},
]
const STATUS_LABEL = {'not-started': "Active", 'in-repair': "In Repair", 'finished': "Retired"}
const STATUS_ICON = {'not-started': <IconShield/>, 'in-repair': <IconExcavator/>, 'finished': <IconDead/>}

function StatusBadge({status, icon = false}: { status: 'not-started' | 'in-repair' | 'finished', icon?: boolean }) {
  const cls =
    status === 'not-started'
      ? 'bg-green-100 text-green-800'
      : status === 'in-repair'
        ? 'bg-yellow-100 text-yellow-800'
        : 'bg-red-100 text-red-800'
  return (
    <span className={`inline-flex items-center justify-center text-xs font-medium h-6 w-6 ${icon ? "" : "px-2.5 py-0.5 w-auto"} rounded ${cls}`}>
      {icon ? STATUS_ICON[status] : STATUS_LABEL[status]}
    </span>
  )
}

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<Asset | null>(null)
  const [editSelected, setEditSelected] = useState<Asset | null>(null)
  const [employees, setEmployees] = useState<{id: string, name: string}[]>([])
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assets`)
      .then(res => res.json())
      .then(res => setAssets(res.data))
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employees`)
      .then(res => res.json())
      .then(res => setEmployees(res.data.map((e: any) => ({id: String(e.id), name: e.name}))))
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-department-names`)
      .then(res => res.json())
      .then(res => setDepartments(res.data.map((d: {name: string}) => d.name)))
  }, [])

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      (a.assignedEmployee?.toLowerCase() ?? '').includes(search.toLowerCase()) ||
      (a.assignedDepartment?.toLowerCase() ?? '').includes(search.toLowerCase());
    const matchCat = !category || a.category === category
    const matchStatus = !status || a.status === status
    return matchSearch && matchCat && matchStatus
  })

  const remove = async (id: string) => {
    if (!confirm('Delete this asset?')) return
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assets/${id}`, {method: 'DELETE'})
    if (res.ok) setAssets(prev => prev.filter(a => a.id !== id))
  }

  const handleSaveEdit = async () => {
    if (!editSelected) return
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assets/${editSelected.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: editSelected.name,
        serialNumber: editSelected.serialNumber,
        category: editSelected.category,
        location: editSelected.location,
        status: editSelected.status,
        purchaseDate: editSelected.purchaseDate,
        price: editSelected.price,
        warrantyExpiration: editSelected.warrantyExpiration,
        manufacturer: editSelected.manufacturer,
        model: editSelected.model,
        notes: editSelected.notes,
        assignedEmployeeId: editSelected.assignedEmployeeId,
        assignedDepartment: editSelected.assignedDepartment,
      }),
    })
    if (res.ok) {
      setAssets(prev => prev.map(a => a.id === editSelected.id ? editSelected : a))
      setEditSelected(null)
    }
  }

  const setEdit = (field: Partial<Asset>) =>
    setEditSelected(prev => prev ? {...prev, ...field} : null)

  const inputCls = "w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">All Assets</h2>
      <p className="text-gray-500 mt-1">Browse and manage all IT assets</p>
      <hr className="my-4 border-gray-200"/>

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
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
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
          <table className="w-full text-sm text-left table-fixed">
            <colgroup>
              <col className="w-20"/>
              <col className="w-36"/>
              <col className="w-28"/>
              <col className="w-28"/>
              <col className="w-36"/>
              <col className="w-36"/>
              <col className="w-16"/>
              <col className="w-28"/>
              <col className="w-24"/>
            </colgroup>
            <thead className="bg-gray-800 text-white text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Asset ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Assigned To (employee)</th>
              <th className="px-4 py-3">Assigned To (department)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Purchase Date</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
            </thead>
            <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id}
                  className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                <td className="px-4 py-3 font-medium truncate max-w-0">{a.id}</td>
                <td className="px-4 py-3 truncate max-w-0">{a.name}</td>
                <td className="px-4 py-3 truncate max-w-0">{a.category}</td>
                <td className="px-4 py-3 truncate max-w-0">{a.location}</td>
                <td className="px-4 py-3 truncate max-w-0">{a.assignedEmployee ?? '—'}</td>
                <td className="px-4 py-3 truncate max-w-0">{a.assignedDepartment ?? '—'}</td>
                <td className="px-4 py-3"><StatusBadge icon status={a.status}/></td>
                <td className="px-4 py-3 text-gray-500 truncate max-w-0">{a.purchaseDate}</td>
                <td className="px-4 py-3 flex gap-1">
                  <button
                    onClick={() => setSelected(a)}
                    className="bg-transparent text-blue-600 rounded hover:bg-blue-50"
                  >
                    <IconEye/>
                  </button>
                  <button
                    onClick={() => setEditSelected(a)}
                    className="bg-transparent text-gray-600 rounded hover:bg-gray-100">
                    <IconEdit/>
                  </button>
                  <button
                    onClick={() => remove(a.id)}
                    className="bg-transparent text-red-600 rounded hover:bg-red-50"
                  >
                    <IconDelete/>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">No assets match your filters.</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
             onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h5 className="font-semibold text-gray-800">Asset Details</h5>
              <button onClick={() => setSelected(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
              <table className="w-full text-sm">
                <tbody>
                {[
                  ['Asset ID', selected.id],
                  ['Name', selected.name],
                  ['Serial Number', selected.serialNumber || '—'],
                  ['Category', selected.category],
                  ['Location', selected.location],
                  ['Manufacturer', selected.manufacturer || '—'],
                  ['Model', selected.model || '—'],
                  ['Assigned Employee', selected.assignedEmployee ?? '—'],
                  ['Assigned Department', selected.assignedDepartment ?? '—'],
                  ['Status', selected.status],
                  ['Purchase Date', selected.purchaseDate],
                  ['Price', selected.price ? `$${Number(selected.price).toFixed(2)}` : '—'],
                  ['Warranty Expiration', selected.warrantyExpiration || '—'],
                  ['Notes', selected.notes || '—'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100 last:border-0">
                    <th className="py-2 pr-4 text-left font-medium text-gray-600 w-36">{k}:</th>
                    <td className="py-2 text-gray-800">{k === 'Status' ?
                      <StatusBadge status={v as 'not-started' | 'in-repair' | 'finished'}/> : v}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t flex justify-end gap-2">
              <button onClick={() => setSelected(null)}
                      className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">Close
              </button>
              <button onClick={() => {
                setSelected(null);
                setEditSelected(selected);
              }}
                      className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">Edit Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editSelected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
             onClick={() => setEditSelected(null)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h5 className="font-semibold text-gray-800">Edit Asset — {editSelected.id}</h5>
              <button onClick={() => setEditSelected(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                  <input value={editSelected.name}
                         onChange={e => setEdit({name: e.target.value})}
                         className={inputCls}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Serial Number</label>
                  <input value={editSelected.serialNumber}
                         onChange={e => setEdit({serialNumber: e.target.value})}
                         className={inputCls}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <select value={editSelected.category}
                          onChange={e => setEdit({category: e.target.value})}
                          className={inputCls}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                  <select value={editSelected.status}
                          onChange={e => setEdit({status: e.target.value as Asset['status']})}
                          className={inputCls}>
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  <select value={editSelected.location}
                          onChange={e => setEdit({location: e.target.value})}
                          className={inputCls}>
                    {LOCATIONS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Purchase Date</label>
                  <input type="date" value={editSelected.purchaseDate}
                         onChange={e => setEdit({purchaseDate: e.target.value})}
                         className={inputCls}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Assigned Employee</label>
                  <select value={editSelected.assignedEmployeeId ?? ''}
                          onChange={e => setEdit({
                            assignedEmployeeId: e.target.value ? Number(e.target.value) : null,
                            assignedEmployee: employees.find(emp => emp.id === e.target.value)?.name ?? null,
                          })}
                          className={inputCls}>
                    <option value="">— None —</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Assigned Department</label>
                  <select value={editSelected.assignedDepartment ?? ''}
                          onChange={e => setEdit({assignedDepartment: e.target.value || null})}
                          className={inputCls}>
                    <option value="">— None —</option>
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Manufacturer</label>
                  <input value={editSelected.manufacturer}
                         onChange={e => setEdit({manufacturer: e.target.value})}
                         className={inputCls}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Model</label>
                  <input value={editSelected.model}
                         onChange={e => setEdit({model: e.target.value})}
                         className={inputCls}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price ($)</label>
                  <input type="number" step="0.01" value={editSelected.price}
                         onChange={e => setEdit({price: Number(e.target.value)})}
                         className={inputCls}/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Warranty Expiration</label>
                  <input type="date" value={editSelected.warrantyExpiration}
                         onChange={e => setEdit({warrantyExpiration: e.target.value})}
                         className={inputCls}/>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                  <textarea value={editSelected.notes} rows={3}
                            onChange={e => setEdit({notes: e.target.value})}
                            className={inputCls}/>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t flex justify-end gap-2">
              <button onClick={() => setEditSelected(null)}
                      className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">Cancel
              </button>
              <button onClick={handleSaveEdit}
                      className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
