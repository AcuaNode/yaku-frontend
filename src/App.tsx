import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EstanquesPage from './pages/EstanquesPage'
import EstanqueDetallePage from './pages/EstanqueDetallePage'
import EquiposPage from './pages/EquiposPage'
import OperadoresPage from './pages/OperadoresPage'
import NotificacionesPage from './pages/NotificacionesPage'
import ConfiguracionPage from './pages/ConfiguracionPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/estanques" element={<EstanquesPage />} />
        <Route path="/estanques/:id" element={<EstanqueDetallePage />} />
        <Route path="/equipos" element={<EquiposPage />} />
        <Route path="/operadores" element={<OperadoresPage />} />
        <Route path="/notificaciones" element={<NotificacionesPage />} />
        <Route path="/configuracion" element={<ConfiguracionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
