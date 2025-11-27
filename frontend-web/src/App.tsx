import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminDashboardPage from './pages/AdminDashboardPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
        <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

