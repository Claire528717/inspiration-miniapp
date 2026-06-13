import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Edit from './pages/Edit'

export default function App() {
  return (
    // 桌面端：居中显示手机框；手机端：全屏
    <div className="phone-shell">
      <div className="phone-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
