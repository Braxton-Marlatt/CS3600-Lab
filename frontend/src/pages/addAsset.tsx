import {useEffect, useState} from 'react'
import type {FormEvent} from 'react'
import {Link} from 'react-router-dom'

const CATEGORIES = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Networking', 'Peripheral', 'Server', 'Other']
const LOCATIONS = ['Main Office', 'Server Room', 'Lab 101', 'Lab 202', 'Storage']
const STATUSES = [
  {value: 'not-started', label: 'Active'},
  {value: 'in-repair', label: 'In Repair'},
  {value: 'finished', label: 'Retired'},
]

export default function AddAsset() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [employees, setEmployees] = useState<{id: string, name: string}[]>([])
  const [departments, setDepartments] = useState<string[]>([])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/employees`)
      .then(res => res.json())
      .then(res => setEmployees(res.data.map((e: any) => ({id: String(e.id), name: e.name}))))
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-department-names`)
      .then(res => res.json())
      .then(res => setDepartments(res.data.map((d: {name: string}) => d.name)))
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.target as HTMLFormElement)
    const body = {
      name: formData.get('name') as string,
      serialNumber: formData.get('serialNumber') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      location: formData.get('location') as string,
      assignedEmployeeId: formData.get('assignedEmployeeId') as string || null,
      assignedDepartment: formData.get('assignedDepartment') as string || null,
      purchaseDate: formData.get('purchaseDate') as string,
      price: Number(formData.get('price')) || 0,
      warrantyExpiration: formData.get('warrantyExpiration') as string,
      manufacturer: formData.get('manufacturer') as string,
      model: formData.get('model') as string,
      notes: formData.get('notes') as string,
    }

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/assets`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    })

    const json = await res.json()
    if (res.ok) {
      setSuccess(true)
      ;(e.target as HTMLFormElement).reset()
      window.scrollTo(0, 0)
    } else {
      setError(json.error || 'Failed to add asset')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-800">Add New Asset</h2>
      <p className="text-gray-500 mt-1">Fill out the form below to add a new asset to the inventory</p>
      <hr className="my-4 border-gray-200"/>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded text-sm">
          Asset has been added successfully!{' '}
          <Link to="/assets" className="underline font-medium">View all assets</Link>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
              <input name="name" type="text" required placeholder="e.g. Dell Latitude 5540"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
              <input name="serialNumber" type="text" placeholder="e.g. SN-1234567890"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select Category --</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select name="status" required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select Status --</option>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <select name="location" required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Select Location --</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (Employee)</label>
              <select name="assignedEmployeeId"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- None --</option>
                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To (Department)</label>
            <select name="assignedDepartment"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- None --</option>
              {departments.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
              <input name="purchaseDate" type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
              <input name="price" type="number" step="0.01" placeholder="0.00"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Expiration</label>
              <input name="warrantyExpiration" type="date"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input name="manufacturer" type="text" placeholder="e.g. Dell, HP, Cisco"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input name="model" type="text" placeholder="e.g. Latitude 5540"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" rows={3} placeholder="Any additional notes about this asset..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700">
              Add Asset
            </button>
            <button type="reset" onClick={() => { setSuccess(false); setError('') }}
              className="bg-gray-500 text-white text-sm px-4 py-2 rounded hover:bg-gray-600">
              Clear Form
            </button>
            <Link to="/assets"
              className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-50">
              Cancel
            </Link>
          </div>
        </form>

        {/* Tips sidebar */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 h-fit">
          <h6 className="font-semibold text-sky-800 mb-2">Tips</h6>
          <ul className="text-sm text-sky-700 space-y-1 list-disc list-inside">
            <li>Fields marked with * are required</li>
            <li>The Asset ID will be generated automatically</li>
            <li>Serial number should match what's on the device</li>
            <li>If the asset isn't assigned yet, leave assignment fields blank</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
