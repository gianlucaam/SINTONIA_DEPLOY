import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Heart, Smile, BookOpen, FileText, Clock } from 'lucide-react';
import { getCurrentPatient, logout } from '../services/spid-auth.service';
import BottomNavigation from '../components/BottomNavigation';
import '../css/Profile.css';

// Mock data matching the design
const mockUserData = {
    name: "Giuseppe",
    badges: {
        total: 80,
        progress: 0.65  // 65% progress
    },
    mood: {
        current: "Triste",
        weekData: [3, 5, 2, 6, 4, 7, 3, 5, 2, 4, 1]  // Bar chart heights
    },
    diary: {
        date: "11/10",
        lastEntry: "Ho trascorso una lunga giornata lavorativa che non mi ha portato a nulla"
    },
    questionnaires: {
        daysAgo: 10,
        message: "Hai un questionario da compilare"
    }
};

// Logout SVG Icon
const LogoutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { name, badges, mood, diary, questionnaires } = mockUserData;

    const handleLogout = () => {
        logout();
        navigate('/spid-info');
    };

    // Calculate circle progress for badges
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (badges.progress * circumference);

    // Normalize mood data for chart (0-10 scale)
    const maxHeight = Math.max(...mood.weekData);
    const normalizedData = mood.weekData.map(val => (val / maxHeight) * 100);

    return (
        <div className="profile-page">
            {/* Organic Background Header */}
            <div className="organic-background">
                <div className="organic-shape shape-1"></div>
                <div className="organic-shape shape-2"></div>
                <div className="organic-shape shape-3"></div>
                <div className="organic-shape shape-4"></div>
            </div>

            {/* Settings Icon */}
            <button className="settings-button" aria-label="Settings">
                <Settings size={24} />
            </button>

            {/* Avatar Section */}
            <div className="avatar-section">
                <div className="avatar-circle">
                    <div className="avatar-placeholder">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="35" r="18" fill="#4A5568" />
                            <path d="M 20 80 Q 20 55 50 55 Q 80 55 80 80" fill="#4A5568" />
                        </svg>
                    </div>
                </div>
                <h1 className="user-name">{name}</h1>
            </div>

            {/* Cards Grid */}
            <div className="profile-cards-grid">
                {/* Badge Card */}
                <div className="profile-card badge-card">
                    <div className="card-header">
                        <Heart size={20} />
                        <span>I Tuoi Badge</span>
                    </div>
                    <div className="badge-progress">
                        <svg className="progress-circle" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                className="progress-background"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                className="progress-bar"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <div className="progress-value">{badges.total}</div>
                    </div>
                </div>

                {/* Mood Card */}
                <div className="profile-card mood-card">
                    <div className="card-header">
                        <Smile size={20} />
                        <span>Stato D'Animo</span>
                    </div>
                    <div className="mood-title">{mood.current}</div>
                    <div className="mood-chart">
                        {normalizedData.map((height, index) => (
                            <div
                                key={index}
                                className="mood-bar"
                                style={{ height: `${height}%` }}
                            ></div>
                        ))}
                    </div>
                    <div className="mood-dots">
                        {normalizedData.map((_, index) => (
                            <div key={index} className="mood-dot"></div>
                        ))}
                    </div>
                </div>

                {/* Diary Card */}
                <div className="profile-card diary-card">
                    <div className="card-header">
                        <BookOpen size={20} />
                        <span>Diario</span>
                    </div>
                    <div className="diary-date">{diary.date}</div>
                    <p className="diary-text">{diary.lastEntry}</p>
                </div>

                {/* Questionnaires Card */}
                <div className="profile-card questionnaire-card">
                    <div className="card-header">
                        <FileText size={20} />
                        <span>Questionari</span>
                    </div>
                    <div className="questionnaire-time">
                        <Clock size={16} />
                        <span>-{questionnaires.daysAgo} giorni fa...</span>
                    </div>
                    <p className="questionnaire-message">{questionnaires.message}</p>
                </div>
            </div>

            {/* Logout Button */}
            <div className="logout-section">
                <button onClick={handleLogout} className="logout-button">
                    <LogoutIcon />
                    <span>Disconnetti</span>
                </button>
            </div>
            <BottomNavigation />
        </div>
    );
};

export default Profile;
