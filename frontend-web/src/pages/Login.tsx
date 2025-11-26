
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';
import { Eye, EyeOff, Edit2, User } from 'lucide-react';
import '../css/Login.css'; // We'll create this CSS file

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberEmail, setRememberEmail] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="logo-container">
                    {/* Placeholder for logo */}
                    <h1 className="logo-text">S<span className="logo-sub">INTONIA</span></h1>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@sintonia.it"
                            />
                            <Edit2 size={18} className="input-icon" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*************"
                            />
                            <button type="button" className="icon-button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="remember-me">
                        <div className="toggle-wrapper">
                            <User size={18} />
                            <span>ricorda l'email</span>
                        </div>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={rememberEmail}
                                onChange={(e) => setRememberEmail(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="login-button">ACCEDI</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
