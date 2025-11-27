import React from 'react';
import AdminProfile from '../components/AdminProfile';
import EmptyState from '../components/EmptyState';
import '../css/PsychologistDashboard.css'; // Reuse layout styles

const AdminDashboard: React.FC = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-grid">
                <div className="dashboard-left">
                    <AdminProfile />
                </div>
                <div className="dashboard-right">
                    <EmptyState />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
