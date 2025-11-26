import React from 'react';
import type { CalendarDay } from '../types/home';

interface CalendarProps {
    days: CalendarDay[];
}

const Calendar: React.FC<CalendarProps> = ({ days }) => {
    return (
        <div className="calendar-section">
            <div className="calendar-header">
                <button className="nav-arrow">‹</button>
                <h2>Oggi</h2>
                <button className="nav-arrow">›</button>
            </div>

            <div className="days-container no-scrollbar">
                {days.map((day, index) => (
                    <div key={index} className={`day-item ${day.isToday ? 'active' : ''}`}>
                        {day.hasEvent && <div className={`dot ${day.isToday ? 'dot-active' : ''}`}></div>}
                        <span className="day-name">{day.day}</span>
                        <span className="day-number">{day.date}</span>
                    </div>
                ))}
            </div>

            <style>{`
                .calendar-section {
                    margin-bottom: 30px;
                }

                .calendar-header {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .calendar-header h2 {
                    font-size: 2rem;
                    font-weight: 800;
                }

                .nav-arrow {
                    background: none;
                    border: none;
                    font-size: 2rem;
                    color: var(--text-dark);
                    cursor: pointer;
                    padding: 0 10px;
                }

                .days-container {
                    display: flex;
                    justify-content: space-between;
                    overflow-x: auto;
                    padding: 0 20px;
                    gap: 10px;
                }

                .day-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-width: 45px;
                    height: 80px;
                    border-radius: 25px;
                    position: relative;
                    padding-top: 10px;
                }

                .day-item.active {
                    background-color: var(--white);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                }

                .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: var(--accent-orange); /* Orange dot */
                    position: absolute;
                    top: 10px;
                }
                
                .dot-active {
                    background-color: var(--primary-dark); /* Dark dot on active */
                }

                .day-name {
                    font-size: 0.8rem;
                    color: var(--text-gray);
                    margin-bottom: 5px;
                }

                .day-number {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-dark);
                }
            `}</style>
        </div>
    );
};

export default Calendar;
