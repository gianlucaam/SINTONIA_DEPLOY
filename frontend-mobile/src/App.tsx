import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/spid-auth.service';
import Splash from './pages/Splash';
import Welcome from './pages/Welcome';
import SPIDInfo from './pages/SPIDInfo';
import SPIDCallback from './pages/SPIDCallback';
import Home from './pages/Home';
import './App.css';

// Protected Route Component
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/spid-info" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/spid-info" element={<SPIDInfo />} />
        <Route path="/spid-callback" element={<SPIDCallback />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/spid-error" element={
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Errore autenticazione SPID</h1>
            <p>Si è verificato un errore durante l'autenticazione.</p>
            <a href="/">Torna alla home</a>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
