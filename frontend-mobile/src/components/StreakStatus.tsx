import React from 'react';
import type { HomeDashboardDto } from '../types/home';

interface StreakStatusProps {
    data: HomeDashboardDto;
}

const StreakStatus: React.FC<StreakStatusProps> = ({ data }) => {
    return (
        <div className="container">
            <div className="streak-card card">
                <div className="streak-icon-container">
                    <div className="fire-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C12 2 4 8 4 14C4 18.4183 7.58172 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 18C13.6569 18 15 16.6569 15 15C15 12 12 10 12 10C12 10 9 12 9 15C9 16.6569 10.3431 18 12 18Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>

                <div className="streak-content">
                    <h3>Completa la Streak!</h3>
                    <div className="progress-bar-container">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className={`progress-segment ${step <= data.streakLevel ? 'active' : ''}`}
                            ></div>
                        ))}
                    </div>
                    <p className="level-text">Livello {data.streakLevel}</p>
                </div>
            </div>

            <style>{`
                .streak-card {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .streak-icon-container {
                    width: 60px;
                    height: 60px;
                    background-color: var(--primary-light);
                    border-radius: 20px; /* Squircle */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .fire-icon {
                    color: var(--white);
                }

                .streak-content {
                    flex: 1;
                }

                .streak-content h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                }

                .progress-bar-container {
                    display: flex;
                    gap: 5px;
                    margin-bottom: 5px;
                }

                .progress-segment {
                    height: 6px;
                    flex: 1;
                    background-color: #e0e0e0;
                    border-radius: 3px;
                }

                .progress-segment.active {
                    background-color: var(--primary-light);
                }

                .level-text {
                    font-size: 0.85rem;
                    color: var(--text-gray);
                }
            `}</style>
        </div>
    );
};

export default StreakStatus;
