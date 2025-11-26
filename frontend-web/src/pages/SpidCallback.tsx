import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const SpidCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                // Decode token to get role
                const decoded: any = jwtDecode(token);
                const role = decoded.role;

                // Salva il token nel localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify({
                    ...decoded,
                    role: role
                }));

                // Redirect based on role
                if (role === 'psychologist' || role === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/patient-dashboard');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                navigate('/spid-error');
            }
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
