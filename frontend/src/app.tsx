import { Routes, Route } from 'react-router-dom'
import Dashboard from "./pages/dashboard.tsx";
import Assets from "./pages/assets.tsx";
import AddAsset from "./pages/addAsset.tsx";
import Employees from "./pages/employees.tsx";
import Departments from "./pages/departments.tsx";
import Navbar from "./components/navbar.tsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/add-asset" element={<AddAsset />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/departments" element={<Departments />} />
      </Routes>
    </div>
  )
}