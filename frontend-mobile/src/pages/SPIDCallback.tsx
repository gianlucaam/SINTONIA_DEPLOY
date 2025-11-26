import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleSPIDCallback } from '../services/spid-auth.service';

const SPIDCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            const success = handleSPIDCallback(token);
            if (success) {
                navigate('/home');
            } else {
                navigate('/spid-error');
            }
        } else {
            const error = searchParams.get('message');
            console.error('SPID error:', error);
            navigate('/spid-error');
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <p>Autenticazione in corso...</p>
        </div>
    );
};

export default SPIDCallback;
