import React from 'react';

type BadgeIconProps = {
    name: string;
    className?: string;
    size?: number;
};

export const BadgeIcon: React.FC<BadgeIconProps> = ({ name, className, size = 48 }) => {
    const getIcon = () => {
        switch (name) {
            // ================== QUESTIONARI ==================
            case 'Primo Questionario':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="12" y="8" width="40" height="48" rx="4" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2" />
                        <path d="M20 20H44" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 28H44" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 36H30" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="46" cy="46" r="14" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
                        <text x="46" y="52" textAnchor="middle" fill="#78350F" fontSize="16" fontWeight="bold">1</text>
                    </svg>
                );
            case 'Cinque Questionari':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="12" width="36" height="44" rx="3" fill="#C7D2FE" stroke="#4F46E5" strokeWidth="2" />
                        <rect x="14" y="8" width="36" height="44" rx="3" fill="#E0E7FF" stroke="#4F46E5" strokeWidth="2" />
                        <circle cx="44" cy="44" r="16" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="2" />
                        <text x="44" y="50" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">5</text>
                    </svg>
                );
            case 'Dieci Questionari':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="26" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
                        <path d="M14 42C14 42 18 24 32 16C46 24 50 42 50 42" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <text x="32" y="40" textAnchor="middle" fill="#78350F" fontSize="20" fontWeight="bold">10</text>
                    </svg>
                );
            case 'Venticinque Questionari':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 14H46L42 44C42 50.6 37.6 56 32 56C26.4 56 22 50.6 22 44L18 14Z" fill="#FCD34D" stroke="#B45309" strokeWidth="2" />
                        <path d="M18 18H10C7.8 18 6 19.8 6 22V26C6 28.2 7.8 30 10 30H19" stroke="#B45309" strokeWidth="2" fill="none" />
                        <path d="M46 18H54C56.2 18 58 19.8 58 22V26C58 28.2 56.2 30 54 30H45" stroke="#B45309" strokeWidth="2" fill="none" />
                        <rect x="26" y="56" width="12" height="4" rx="1" fill="#B45309" />
                        <text x="32" y="38" textAnchor="middle" fill="#78350F" fontSize="14" fontWeight="bold">25</text>
                    </svg>
                );
            case 'Screening Completo':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="14" y="10" width="36" height="48" rx="4" fill="#06B6D4" stroke="#0E7490" strokeWidth="2" />
                        <rect x="22" y="6" width="20" height="8" rx="2" fill="#CFFAFE" stroke="#0E7490" strokeWidth="2" />
                        <path d="M22 24L26 28L34 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 36L26 40L34 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M22 48L26 52L34 44" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );

            // ================== DIARIO ==================
            case 'Prima Nota Diario':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="12" y="10" width="32" height="44" rx="2" fill="#F3F4F6" stroke="#4B5563" strokeWidth="2" />
                        <path d="M20 22H36" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 30H36" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 38H28" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 38L54 12L58 16L42 42H38V38Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                    </svg>
                );
            case 'Diario Costante':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="14" width="44" height="40" rx="4" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2" />
                        <path d="M10 24H54" stroke="#2563EB" strokeWidth="2" />
                        <path d="M20 10V18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                        <path d="M44 10V18" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                        <path d="M20 34L24 38L32 30" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M36 42L40 46L48 38" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'Narratore':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 16V54" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
                        <path d="M32 16C24 16 10 20 10 20V50C10 50 24 48 32 54" fill="#FEF9C3" stroke="#4B5563" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M32 16C40 16 54 20 54 20V50C54 50 40 48 32 54" fill="#FEF9C3" stroke="#4B5563" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M16 28H26" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M16 36H26" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 28H48" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                        <path d="M38 36H48" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Diario Esperto':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="16" y="10" width="32" height="48" rx="2" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2" />
                        <path d="M44 10V32L38 26L32 32V10" fill="#FCD34D" />
                        <circle cx="40" cy="44" r="12" fill="#F472B6" stroke="#BE185D" strokeWidth="2" />
                        <path d="M40 38L42 42H46L43 45L44 49L40 46L36 49L37 45L34 42H38L40 38Z" fill="white" />
                    </svg>
                );

            // ================== STATO D'ANIMO ==================
            case 'Primo Stato dAnimo':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="26" fill="#FDE047" stroke="#CA8A04" strokeWidth="2" />
                        <circle cx="24" cy="26" r="4" fill="#78350F" />
                        <circle cx="40" cy="26" r="4" fill="#78350F" />
                        <path d="M20 38C20 38 24 46 32 46C40 46 44 38 44 38" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                        <path d="M48 12L52 8M56 18L62 16" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                );
            case 'Monitoraggio Umore':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="8" width="48" height="48" rx="6" fill="#F3F4F6" stroke="#4B5563" strokeWidth="2" />
                        <rect x="14" y="36" width="8" height="16" rx="2" fill="#3B82F6" />
                        <rect x="26" y="28" width="8" height="24" rx="2" fill="#3B82F6" />
                        <rect x="38" y="20" width="8" height="32" rx="2" fill="#10B981" />
                        <rect x="50" y="14" width="8" height="38" rx="2" fill="#10B981" />
                    </svg>
                );
            case 'Streak Week':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 6C32 6 18 22 18 38C18 48 24 56 32 56C40 56 46 48 46 38C46 22 32 6 32 6Z" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
                        <path d="M32 20C32 20 24 32 24 40C24 46 28 50 32 50C36 50 40 46 40 40C40 32 32 20 32 20Z" fill="#FCD34D" />
                        <text x="32" y="44" textAnchor="middle" fill="#9A3412" fontSize="16" fontWeight="bold">7</text>
                    </svg>
                );
            case 'Streak Master':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 10C32 10 14 28 14 44C14 56 22 62 32 62C42 62 50 56 50 44C50 28 32 10 32 10Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
                        <path d="M32 24C32 24 20 38 20 48C20 54 26 58 32 58C38 58 44 54 44 48C44 38 32 24 32 24Z" fill="#FCD34D" />
                        <path d="M20 14L24 22L32 10L40 22L44 14" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <text x="32" y="52" textAnchor="middle" fill="#991B1B" fontSize="14" fontWeight="bold">30</text>
                    </svg>
                );

            // ================== FORUM ==================
            case 'Prima Domanda Forum':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16C12 12 15 9 19 9H45C49 9 52 12 52 16V36C52 40 49 43 45 43H26L14 52V16Z" fill="#A7F3D0" stroke="#059669" strokeWidth="2" />
                        <text x="32" y="34" textAnchor="middle" fill="#047857" fontSize="26" fontWeight="bold">?</text>
                    </svg>
                );
            case 'Voce Attiva':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 24V40H22L40 54V10L22 24H14Z" fill="#F472B6" stroke="#DB2777" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M48 22C52 26 52 38 48 42" stroke="#DB2777" strokeWidth="3" strokeLinecap="round" />
                        <path d="M54 16C60 24 60 40 54 48" stroke="#DB2777" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                );
            case 'Prima Risposta Ricevuta':
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="8" y="18" width="48" height="32" rx="4" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="2" />
                        <path d="M8 22L32 40L56 22" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="48" cy="42" r="12" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
                        <path d="M44 42L46 44L52 38" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );

            default:
                return (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="32" cy="32" r="26" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />
                        <path d="M32 18L36 30H48L38 38L42 50L32 42L22 50L26 38L16 30H28L32 18Z" fill="#D1D5DB" />
                    </svg>
                );
        }
    };

    return (
        <div style={{ width: size, height: size }} className={className}>
            {getIcon()}
        </div>
    );
};
