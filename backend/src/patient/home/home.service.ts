import { Injectable } from '@nestjs/common';
import { HomeDashboardDto } from '../dto/home-dashboard.dto.js';
import { db } from '../../drizzle/db.js';
import { paziente, statoAnimo, domandaForum, questionario, tipologiaQuestionario, rispostaForum } from '../../drizzle/schema.js';
import { eq, desc,} from 'drizzle-orm';


@Injectable()
export class HomeService {
    async getDashboard(userId: string): Promise<HomeDashboardDto> {
        const [firstName, mood, notificationsCount, suggestedPosts, calendarDays] = await Promise.all([
            this.getFirstName(userId),
            this.getLastMood(userId),
            this.getPendingQuestionnairesCount(userId),
            this.getSuggestedPosts(),
            this.getCalendarDays(userId),
        ]);

        return {
            firstName,
            mood,
            notificationsCount,
            streakLevel: 3, // TODO: calcolare da eventi consecutivi
            streakProgress: 75, // TODO: progress dello streak
            dailyNote: '', // TODO: ultima nota del giorno da pagina_diario
            calendarDays,
            suggestedPosts,
        };
    }
    //Ottieni il nome dell'utente
    private async getFirstName(userId: string): Promise<string> {
        const rows = await db
            .select({ firstName: paziente.nome })
            .from(paziente)
            .where(eq(paziente.idPaziente, userId))
            .limit(1);
        return rows[0]?.firstName ?? 'Utente';
    }
    //Ottieni l'ultimo stato d'umore dell'utente
    private async getLastMood(userId: string): Promise<string> {
        const rows = await db
            .select({ umore: statoAnimo.umore })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(1);
        return rows[0]?.umore ?? 'Neutro';
    }
    //Ottieni numero questionari non compilati
    private async getPendingQuestionnairesCount(userId: string): Promise<number> {
        const patientRow = await db
            .select({ dataIngresso: paziente.dataIngresso })
            .from(paziente)
            .where(eq(paziente.idPaziente, userId))
            .limit(1);

        const dataIngressoStr = patientRow[0]?.dataIngresso;
        if (!dataIngressoStr) return 0;

        const dataIngressoDate = new Date(dataIngressoStr);
        const today = new Date();
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysSinceIngresso = Math.floor((today.getTime() - dataIngressoDate.getTime()) / msPerDay);

        const allTypes = await db
            .select({ nome: tipologiaQuestionario.nome, tempo: tipologiaQuestionario.tempoSomministrazione })
            .from(tipologiaQuestionario);

        const dueTypeNames = allTypes.filter(t => t.tempo <= daysSinceIngresso).map(t => t.nome);

        const compiled = await db
            .select({ nome: questionario.nomeTipologia })
            .from(questionario)
            .where(eq(questionario.idPaziente, userId));

        const compiledSet = new Set(compiled.map(c => c.nome));
        return dueTypeNames.filter(n => !compiledSet.has(n)).length;
    }
    //Ottieni i post suggeriti
    private async getSuggestedPosts() {
        // Ultime 3 domande che hanno almeno una risposta
        const rows = await db
            .select({
                id: domandaForum.idDomanda,
                category: domandaForum.categoria,
                title: domandaForum.titolo,
                contentSnippet: domandaForum.testo,
                createdAt: domandaForum.dataInserimento,
            })
            .from(domandaForum)
            .innerJoin(rispostaForum, eq(rispostaForum.idDomanda, domandaForum.idDomanda))
            .groupBy(
                domandaForum.idDomanda,
                domandaForum.categoria,
                domandaForum.titolo,
                domandaForum.testo,
                domandaForum.dataInserimento,
            )
            .orderBy(desc(domandaForum.dataInserimento))
            .limit(3);

        return rows.map(({ createdAt, ...post }) => ({
            ...post,
            contentSnippet: post.contentSnippet.substring(0, 50) + (post.contentSnippet.length > 50 ? '...' : ''),
        }));
    }

    private async getCalendarDays(userId: string) {
        const calendarDays: { day: string; date: number; fullDate: string; hasEvent: boolean; isToday: boolean }[] = [];
        const today = new Date();

        const recentMoods = await db
            .select({ date: statoAnimo.dataInserimento })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(10);

        const moodDates = new Set(recentMoods.map(m => m.date.toISOString().split('T')[0]));

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
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

        return calendarDays;
    }
}
