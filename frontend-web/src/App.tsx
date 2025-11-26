import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PsychologistDashboard from './pages/PsychologistDashboard';
import { getCurrentUser } from './services/auth.service';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* Login per admin/psicologi */}
        <Route path="/login" element={<Login />} />


        {/* Dashboard admin/psicologo */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
                <PsychologistDashboard />
            </PrivateRoute>
          }
        />
        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App
