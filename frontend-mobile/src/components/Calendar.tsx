import React, { useState, useEffect } from 'react';
import type { CalendarDay } from '../types/home';

interface CalendarProps {
    days: CalendarDay[]; // Initial data from backend
}

const Calendar: React.FC<CalendarProps> = ({ days: initialDays }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [displayDays, setDisplayDays] = useState<CalendarDay[]>([]);

    // Create a map of date -> mood from the initial backend data
    // We use a map for quick lookup when rendering days
    const moodMap = React.useMemo(() => {
        const map = new Map<string, string>();
        initialDays.forEach(day => {
            if (day.mood) {
                map.set(day.fullDate, day.mood);
            }
        });
        return map;
    }, [initialDays]);

    useEffect(() => {
        generateDays(startDate);
    }, [startDate, moodMap]);

    const generateDays = (start: Date) => {
        const newDays: CalendarDay[] = [];
        const todayStr = new Date().toISOString().split('T')[0];

        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('it-IT', { weekday: 'short' });
            const dayNumber = date.getDate();

            // Check if we have mood data for this date
            const mood = moodMap.get(dateString);

            newDays.push({
                day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                date: dayNumber,
                fullDate: dateString,
                hasEvent: !!mood,
                isToday: dateString === todayStr,
                mood: mood,
            });
        }
        setDisplayDays(newDays);
    };

    const handlePrev = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() - 1);
        setStartDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + 1);
        setStartDate(newDate);
    };

    return (
        <div className="calendar-section">
            <div className="calendar-header">
                <button className="nav-arrow" onClick={handlePrev}>‹</button>
                <h2>Oggi</h2>
                <button className="nav-arrow" onClick={handleNext}>›</button>
            </div>

            <div className="days-container no-scrollbar">
                {displayDays.map((day, index) => (
                    <div key={index} className={`day-item ${day.isToday ? 'active' : ''}`}>
                        {day.hasEvent && (
                            <div
                                className="dot"
                                style={{ backgroundColor: getMoodColor(day.mood) }}
                            ></div>
                        )}
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
                    background-color: var(--text-gray); /* Default gray */
                    position: absolute;
                    top: 10px;
                }
                
                .dot-active {
                    /* No specific active style needed if color is dynamic, but keeping for structure */
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

const getMoodColor = (mood?: string): string => {
    switch (mood?.toLowerCase()) {
        case 'felice': return '#4CAF50'; // Green
        case 'triste': return '#2196F3'; // Blue
        case 'ansia': return '#FF9800'; // Orange
        case 'rabbia': return '#F44336'; // Red
        case 'neutro': return '#9E9E9E'; // Gray
        default: return '#88b7b5'; // Default teal
    }
};

export default Calendar;
