import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Splash.css';

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Navigate to welcome after 2 seconds
        const timer = setTimeout(() => {
            navigate('/welcome');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="splash-container">
            <div className="logo">
                <img src="/sintonia-logo-new.jpg" alt="Sintonia" className="splash-logo-img" />
            </div>
        </div>
    );
};

export default Splash;
