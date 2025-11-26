import type { HomeDashboardDto } from '../types/home';

export const getHomeDashboard = async (): Promise<HomeDashboardDto> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        firstName: 'Giuseppe',
        mood: 'Felice',
        notificationsCount: 3,
        streakLevel: 3,
        streakProgress: 75,
        dailyNote: '',
        calendarDays: [
            { day: 'Lun', date: 12, fullDate: '2025-12-12', hasEvent: true, isToday: false },
            { day: 'Mar', date: 13, fullDate: '2025-12-13', hasEvent: false, isToday: false },
            { day: 'Mer', date: 14, fullDate: '2025-12-14', hasEvent: true, isToday: false },
            { day: 'Gio', date: 15, fullDate: '2025-12-15', hasEvent: true, isToday: true },
            { day: 'Ven', date: 16, fullDate: '2025-12-16', hasEvent: false, isToday: false },
            { day: 'Sab', date: 17, fullDate: '2025-12-17', hasEvent: false, isToday: false },
            { day: 'Dom', date: 18, fullDate: '2025-12-18', hasEvent: false, isToday: false },
        ],
        suggestedPosts: [
            {
                id: '1',
                category: 'ANSIA',
                title: 'Domani ho un esame e non so gestire l\'ansia, ho paura di fallire. Consigli?',
                contentSnippet: 'Ho paura di fallire. Consigli?',
            },
            {
                id: '2',
                category: 'VITA DI COPPIA',
                title: 'La mia ragazza mi ha lasciato, adesso mi sento solo come posso fare?',
                contentSnippet: 'Adesso mi sento solo come posso fare?',
            },
        ],
    };
};
