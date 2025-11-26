import { Injectable } from '@nestjs/common';
import { HomeDashboardDto } from '../dto/home-dashboard.dto.js';
import { db } from '../../drizzle/db.js';
import { paziente, statoAnimo, ricezioneNotificaPaziente, domandaForum } from '../../drizzle/schema.js';
import { eq, desc, count } from 'drizzle-orm';

@Injectable()
export class HomeService {
    async getDashboard(userId: string): Promise<HomeDashboardDto> {
        // 1. Fetch Patient Details
        const patientData = await db
            .select({
                firstName: paziente.nome,
            })
            .from(paziente)
            .where(eq(paziente.idPaziente, userId))
            .limit(1);

        const firstName = patientData.length > 0 ? patientData[0].firstName : 'Utente';

        // 2. Fetch Latest Mood
        const lastMood = await db
            .select({
                umore: statoAnimo.umore,
            })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(1);

        const mood = lastMood.length > 0 ? lastMood[0].umore : 'Neutro';

        // 3. Fetch Notifications Count (Mocking logic as "unread" isn't explicitly in schema, counting all for now)
        const notificationsResult = await db
            .select({ count: count() })
            .from(ricezioneNotificaPaziente)
            .where(eq(ricezioneNotificaPaziente.idPaziente, userId));

        const notificationsCount = Number(notificationsResult[0]?.count || 0);

        // 4. Suggested Posts (Fetching recent posts from forum)
        const suggestedPostsData = await db
            .select({
                id: domandaForum.idDomanda,
                category: domandaForum.categoria,
                title: domandaForum.titolo,
                contentSnippet: domandaForum.testo,
            })
            .from(domandaForum)
            .orderBy(desc(domandaForum.dataInserimento))
            .limit(2);

        const suggestedPosts = suggestedPostsData.map(post => ({
            ...post,
            contentSnippet: post.contentSnippet.substring(0, 50) + (post.contentSnippet.length > 50 ? '...' : ''),
        }));

        // 5. Calendar Days (Generating last 7 days and checking for events)
        const calendarDays: { day: string; date: number; fullDate: string; hasEvent: boolean; isToday: boolean; }[] = [];
        const today = new Date();

        // Fetch recent mood entries to mark "hasEvent"
        const recentMoods = await db
            .select({ date: statoAnimo.dataInserimento })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(10); // Fetch enough to cover the week

        const moodDates = new Set(recentMoods.map(m => m.date.toISOString().split('T')[0]));

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i); // Next 7 days? Or past? UI usually shows current week or surrounding. Let's do current week starting today or centered.
            // Let's match the mock: "Lun 12", "Mar 13". 
            // We'll generate for the current week.

            const dateString = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('it-IT', { weekday: 'short' });
            const dayNumber = date.getDate();

            calendarDays.push({
                day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                date: dayNumber,
                fullDate: dateString,
                hasEvent: moodDates.has(dateString),
                isToday: i === 0,
            });
        }

        return {
            firstName,
            mood,
            notificationsCount,
            streakLevel: 3, // Placeholder
            streakProgress: 75, // Placeholder
            dailyNote: '', // Placeholder
            calendarDays,
            suggestedPosts,
        };
    }
}
