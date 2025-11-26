import axios from 'axios';

const API_URL = 'http://localhost:3000/spid-auth';

export const startSPIDLogin = () => {
    // Redirect to backend SPID login endpoint
    window.location.href = `${API_URL}/login`;
};

export const handleSPIDCallback = (token: string) => {
    if (token) {
        localStorage.setItem('patient_token', token);
        return true;
    }
    return false;
};

export const getCurrentPatient = () => {
    const token = localStorage.getItem('patient_token');
    if (!token) return null;

    // Decode JWT (simplified, in production use jwt-decode)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch (e) {
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('patient_token');
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('patient_token');
};
