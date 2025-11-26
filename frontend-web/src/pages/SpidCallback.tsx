import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SpidCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Salva il token nel localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ role: 'patient' }));

            // Redirect alla dashboard paziente
            navigate('/patient-dashboard');
        } else {
            // Se non c'è token, errore
            navigate('/spid-error');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '20px',
                    animation: 'spin 1s linear infinite'
                }}>
                    ⟳
                </div>
                <p style={{ fontSize: '18px', color: '#666' }}>Autenticazione in corso...</p>
            </div>
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default SpidCallback;
