import type { HomeDashboardDto } from '../types/home';

export const getHomeDashboard = async (): Promise<HomeDashboardDto> => {
    try {
        const token = localStorage.getItem('patient_token');
        if (!token) {
            // Redirect to login if no token
            throw new Error('Missing auth token');
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/paziente/home`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 401 || response.status === 403) {
            // Token invalid/expired -> clear
            localStorage.removeItem('patient_token');
            throw new Error(`Unauthorized`);
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching home dashboard:', error);
        throw error;
    }
};
