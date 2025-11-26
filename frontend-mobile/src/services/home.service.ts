import type { HomeDashboardDto } from '../types/home';

export const getHomeDashboard = async (): Promise<HomeDashboardDto> => {
    try {
        const response = await fetch('http://localhost:3000/paziente/home');
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
