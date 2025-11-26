import { Injectable } from '@nestjs/common';
import { HomeDashboardDto } from '../dto/home-dashboard.dto.js';
import { db } from '../../drizzle/db.js';
import { paziente, statoAnimo, domandaForum, questionario, tipologiaQuestionario, rispostaForum } from '../../drizzle/schema.js';
import { eq, desc,} from 'drizzle-orm';


@Injectable()
export class HomeService {
    async getDashboard(userId: string): Promise<HomeDashboardDto> {
        const [firstName, mood, notificationsCount, suggestedPosts, calendarDays, consecutiveDays] = await Promise.all([
            this.getFirstName(userId),
            this.getLastMood(userId),
            this.getPendingQuestionnairesCount(userId),
            this.getSuggestedPosts(),
            this.getCalendarDays(userId),
            this.getConsecutiveMoodDays(userId),
        ]);

        const streakLevel = Math.floor(consecutiveDays / 7);
        const streakProgress = Math.round(((consecutiveDays % 7) / 7) * 100);

        return {
            firstName,
            mood,
            notificationsCount,
            streakLevel,
            streakProgress,
            calendarDays,
            suggestedPosts,
        };
    }
    
    // Formatter per ottenere YYYY-MM-DD in timezone locale
    private formatLocalDate(date: Date): string {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
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

        // Prendiamo un margine sufficiente (es. 30) per coprire gli ultimi 7 giorni
        const recentMoods = await db
            .select({ date: statoAnimo.dataInserimento })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento));

        const moodDates = new Set(recentMoods.map(m => this.formatLocalDate(new Date(m.date))));

        // Ultimi 7 giorni: da today-6 a today
        for (let offset = 6; offset >= 0; offset--) {
            const date = new Date(today);
            date.setHours(0, 0, 0, 0);
            date.setDate(today.getDate() - offset);

            const dateString = this.formatLocalDate(date);
            const dayName = date.toLocaleDateString('it-IT', { weekday: 'short' });
            const dayNumber = date.getDate();

            calendarDays.push({
                day: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                date: dayNumber,
                fullDate: dateString,
                hasEvent: moodDates.has(dateString),
                isToday: offset === 0,
            });
        }

        return calendarDays;
    }

    // Calcola i giorni consecutivi di compilazione stato d'animo fino a oggi (incluso)
    private async getConsecutiveMoodDays(userId: string): Promise<number> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Recupera un numero ragionevole di record per valutare la streak
        const moods = await db
            .select({ date: statoAnimo.dataInserimento })
            .from(statoAnimo)
            .where(eq(statoAnimo.idPaziente, userId))
            .orderBy(desc(statoAnimo.dataInserimento))
            .limit(90);

        const moodSet = new Set(moods.map(m => this.formatLocalDate(new Date(m.date))));

        let consecutive = 0;
        // Partiamo da oggi e torniamo indietro fino a quando troviamo un giorno senza evento
        for (let i = 0; i < 365; i++) { // safety cap
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = this.formatLocalDate(d);
            if (moodSet.has(key)) {
                consecutive += 1;
            } else {
                break;
            }
        }

        return consecutive;
    }
}
