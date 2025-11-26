import React from 'react';
import type { HomeDashboardDto } from '../types/home';

interface HeaderProps {
    data: HomeDashboardDto;
}

const Header: React.FC<HeaderProps> = ({ data }) => {
    return (
        <header className="header">
            <div className="header-top">
                <div className="date-display">
                    <span className="calendar-icon">📅</span>
                    <span>Gio, 15 Dic 2025</span> {/* Hardcoded for design match, or use real date */}
                </div>
                <div className="status-bar-placeholder">
                    {/* Status bar area handled by OS/Device, but we leave space if needed */}
                </div>
            </div>

            <div className="user-section">
                <div className="user-info">
                    <div className="avatar">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Giuseppe" alt="Avatar" />
                    </div>
                    <div className="greeting-text">
                        <h1>Ciao, {data.firstName}!</h1>
                        <div className="mood-badge">
                            <span className="mood-icon">🙂</span>
                            <span>{data.mood}</span>
                        </div>
                    </div>
                </div>

                <div className="notification-icon">
                    <div className="icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 11C9 11 9 12.5 10 13.5C11 14.5 12.5 14.5 12.5 14.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="5" y="4" width="14" height="16" rx="3" stroke="white" strokeWidth="2" />
                            <path d="M15 8L9 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    {data.notificationsCount > 0 && (
                        <span className="badge">+{data.notificationsCount}</span>
                    )}
                </div>
            </div>

            <style>{`
                .header {
                    background-color: var(--primary-dark);
                    color: var(--white);
                    padding: 40px 20px 30px;
                    border-bottom-left-radius: 30px;
                    border-bottom-right-radius: 30px;
                    position: relative;
                }
                
                .header-top {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                    opacity: 0.9;
                }

                .date-display {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .user-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .avatar {
                    width: 60px;
                    height: 60px;
                    background-color: #f2d4c9; /* Skin tone bg */
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .greeting-text h1 {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 5px;
                }

                .mood-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 0.9rem;
                    opacity: 0.9;
                }

                .notification-icon {
                    position: relative;
                }

                .icon-box {
                    width: 50px;
                    height: 50px;
                    background-color: var(--primary-light);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background-color: var(--white);
                    color: var(--primary-dark);
                    font-size: 0.75rem;
                    font-weight: bold;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            `}</style>
        </header>
    );
};

export default Header;
