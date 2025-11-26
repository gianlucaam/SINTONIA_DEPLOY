
import { getCurrentUser, logout, getUserRole } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const user = getCurrentUser();
    const role = getUserRole();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.user?.email || user?.user?.nome}</p>
            <p style={{ fontWeight: 'bold', color: role === 'admin' ? '#e74c3c' : '#3498db' }}>
                Ruolo: {role === 'admin' ? 'Amministratore' : 'Psicologo'}
            </p>

            <div style={{ marginTop: '30px' }}>
                <h2>Funzioni disponibili</h2>

                {role === 'admin' && (
                    <div style={{ padding: '20px', backgroundColor: '#ffe6e6', borderRadius: '8px', marginBottom: '10px' }}>
                        <h3>👨‍💼 Funzioni Amministratore</h3>
                        <ul>
                            <li>Gestione utenti</li>
                            <li>Gestione psicologi</li>
                            <li>Statistiche globali</li>
                            <li>Configurazione sistema</li>
                        </ul>
                    </div>
                )}

                {role === 'psychologist' && (
                    <div style={{ padding: '20px', backgroundColor: '#e6f2ff', borderRadius: '8px', marginBottom: '10px' }}>
                        <h3>🧠 Funzioni Psicologo</h3>
                        <ul>
                            <li>Gestione pazienti</li>
                            <li>Visualizzazione questionari</li>
                            <li>Report clinici</li>
                            <li>Calendario appuntamenti</li>
                        </ul>
                    </div>
                )}
            </div>

            <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
        </div>
    );
};

export default Dashboard;
