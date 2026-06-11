import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'

export default function App() {
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
