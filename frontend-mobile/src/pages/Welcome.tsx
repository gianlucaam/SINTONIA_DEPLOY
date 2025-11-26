import { useNavigate } from 'react-router-dom';
import '../css/Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <div className="quote-section">
                    <p className="quote">"Dove la mente trova la pace,</p>
                    <p className="quote">un passo alla volta"</p>
                </div>
                <button className="welcome-btn" onClick={() => navigate('/spid-info')}>
                    Accedi
                </button>
            </div>
        </div>
    );
};

export default Welcome;
