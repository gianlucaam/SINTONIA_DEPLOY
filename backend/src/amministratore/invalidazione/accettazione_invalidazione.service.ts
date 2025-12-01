import { Injectable } from '@nestjs/common';
import { eq, and, gt, desc, lt, gte } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { questionario, paziente } from '../../drizzle/schema.js';
import { ScoreService } from '../../patient/score/score.service.js';
import { PrioritaService } from '../../patient/priorita/priorita.service.js';

@Injectable()
export class Accettazione_invalidazioneService {
    constructor(
        private readonly scoreService: ScoreService,
        private readonly prioritaService: PrioritaService
    ) { }

    /**
     * Trova il questionario PRECEDENTE con cambiamento=true
     */
    private async trovaQuestionarioPrecedenteConCambiamento(
        idPaziente: string,
        dataQuestionarioInvalidato: Date
    ): Promise<{ id: string; data: Date } | null> {
        const precedente = await db
            .select({
                id: questionario.idQuestionario,
                data: questionario.dataCompilazione,
            })
            .from(questionario)
            .where(
                and(
                    eq(questionario.idPaziente, idPaziente),
                    lt(questionario.dataCompilazione, dataQuestionarioInvalidato),
                    eq(questionario.cambiamento, true),
                    eq(questionario.invalidato, false)
                )
            )
            .orderBy(desc(questionario.dataCompilazione))
            .limit(1);

        return precedente[0] || null;
    }

    /**
     * Ricalcola score incrementalmente da un punto di partenza
     * Aggiunge un questionario alla volta e verifica se raggiunge la fascia attuale
     */
    private async ricalcolaScoreIncrementale(
        idPaziente: string,
        dataInizio: Date,
        idQuestionarioPrecedente: string // AGGIUNTO: per non resettare il suo cambiamento
    ): Promise<boolean> {
        // 1. Ottieni priorità attuale e fascia
        const pazienteData = await db.query.paziente.findFirst({
            where: eq(paziente.idPaziente, idPaziente),
        });

        if (!pazienteData) {
            throw new Error(`Paziente con ID ${idPaziente} non trovato`);
        }

        const prioritaAttuale = pazienteData.idPriorita;
        const fascia = await this.prioritaService.getFasciaPriorita(prioritaAttuale);
        const scoreMin = fascia.punteggioInizio;

        console.log(`Ricalcolo incrementale per priorità ${prioritaAttuale}, score min: ${scoreMin}`);

        // 2. Ottieni tutti i questionari DOPO dataInizio (esclusi invalidati)
        // IMPORTANTE: gt (>) invece di gte (>=) per NON includere il questionario di partenza
        const questionariDaRicalcolare = await db
            .select({
                id: questionario.idQuestionario,
                data: questionario.dataCompilazione,
            })
            .from(questionario)
            .where(
                and(
                    eq(questionario.idPaziente, idPaziente),
                    gt(questionario.dataCompilazione, dataInizio), // CAMBIATO: gt invece di gte
                    eq(questionario.invalidato, false)
                )
            )
            .orderBy(questionario.dataCompilazione);

        console.log(`Trovati ${questionariDaRicalcolare.length} questionari da ricalcolare`);

        // 3. RESET cambiamento su tutti i questionari da ricalcolare
        // IMPORTANTE: NON resettare il questionario precedente (punto di partenza)
        for (const q of questionariDaRicalcolare) {
            if (q.id !== idQuestionarioPrecedente) { // AGGIUNTO: skip questionario precedente
                await db
                    .update(questionario)
                    .set({ cambiamento: false })
                    .where(eq(questionario.idQuestionario, q.id));
            }
        }

        let raggiuntaFascia = false;
        let idQuestionarioCambiamento: string | null = null;

        // 4. Ricalcola incrementalmente
        for (let i = 0; i < questionariDaRicalcolare.length; i++) {
            const q = questionariDaRicalcolare[i];

            // Calcola score fino a questo questionario (SENZA aggiornare priorità)
            // Questo evita che updatePrioritaPaziente imposti cambiamento durante il ricalcolo
            await this.scoreService.updatePatientScoreOnly(idPaziente);

            // Ottieni score calcolato
            const pazienteAggiornato = await db.query.paziente.findFirst({
                where: eq(paziente.idPaziente, idPaziente),
            });

            const scoreAttuale = pazienteAggiornato?.score || 0;

            console.log(`Questionario ${i + 1}/${questionariDaRicalcolare.length}: score = ${scoreAttuale}`);

            // Verifica se raggiunge la fascia attuale
            // IMPORTANTE: Non uso !raggiuntaFascia perché voglio l'ULTIMO questionario che mantiene la fascia
            if (scoreAttuale >= scoreMin) {
                raggiuntaFascia = true;
                idQuestionarioCambiamento = q.id; // Aggiorna sempre, così prendo l'ultimo
                console.log(`Raggiunta fascia ${prioritaAttuale} con questionario ${q.id}`);
            }
        }

        // 5. Imposta cambiamento SOLO sul questionario che ha raggiunto la fascia
        if (raggiuntaFascia && idQuestionarioCambiamento) {
            await db
                .update(questionario)
                .set({ cambiamento: true })
                .where(eq(questionario.idQuestionario, idQuestionarioCambiamento));

            console.log(`Impostato cambiamento=true su questionario ${idQuestionarioCambiamento}`);
        }

        return raggiuntaFascia;
    }

    /**
     * Forza il downgrade della priorità di una fascia
     */
    private async downgradePriorita(idPaziente: string): Promise<void> {
        const pazienteData = await db.query.paziente.findFirst({
            where: eq(paziente.idPaziente, idPaziente),
        });

        if (!pazienteData) {
            throw new Error(`Paziente con ID ${idPaziente} non trovato`);
        }

        const prioritaAttuale = pazienteData.idPriorita;

        const downgradeMap: Record<string, string> = {
            'Urgente': 'Breve',
            'Breve': 'Differibile',
            'Differibile': 'Programmabile',
            'Programmabile': 'Programmabile',
        };

        const nuovaPriorita = downgradeMap[prioritaAttuale] || 'Programmabile';

        await db
            .update(paziente)
            .set({ idPriorita: nuovaPriorita as any })
            .where(eq(paziente.idPaziente, idPaziente));

        console.log(`Priorità downgrade: ${prioritaAttuale} → ${nuovaPriorita}`);
    }

    /**
     * Accetta richiesta di invalidazione con ricalcolo incrementale
     */
    async accettaRichiestaInvalidazione(
        idQuestionario: string,
        emailAmministratore: string,
    ): Promise<void> {
        // 1. Ottieni questionario da invalidare
        const quest = await db.query.questionario.findFirst({
            where: eq(questionario.idQuestionario, idQuestionario),
        });

        if (!quest) {
            throw new Error('Questionario non trovato');
        }

        const idPaziente = quest.idPaziente;
        const dataQuestionario = new Date(quest.dataCompilazione);

        console.log(`\n=== INVALIDAZIONE QUESTIONARIO ${idQuestionario} ===`);

        // 2. Invalida questionario e reset cambiamento
        await db
            .update(questionario)
            .set({
                invalidato: true,
                dataInvalidazione: new Date(),
                idAmministratoreConferma: emailAmministratore,
                cambiamento: false,
            })
            .where(eq(questionario.idQuestionario, idQuestionario));

        console.log('Questionario invalidato, cambiamento resettato');

        // 3. Trova questionario PRECEDENTE con cambiamento=true
        const precedente = await this.trovaQuestionarioPrecedenteConCambiamento(
            idPaziente,
            dataQuestionario
        );

        if (!precedente) {
            console.log('Nessun questionario precedente con cambiamento');
            console.log('Ricalcolo incrementale dall\'inizio (primo questionario)');

            // Trova il PRIMO questionario del paziente (non invalidato)
            const primoQuestionario = await db.query.questionario.findFirst({
                where: and(
                    eq(questionario.idPaziente, idPaziente),
                    eq(questionario.invalidato, false)
                ),
                orderBy: questionario.dataCompilazione, // ASC (primo)
            });

            if (!primoQuestionario) {
                console.log('Nessun questionario valido rimasto');
                return;
            }

            // Usa data molto vecchia per includere tutti i questionari
            const dataInizio = new Date(0); // 1970-01-01

            // Ricalcola incrementalmente dall'inizio
            const raggiuntaFascia = await this.ricalcolaScoreIncrementale(
                idPaziente,
                dataInizio,
                '' // Nessun questionario da preservare
            );

            // Se non raggiunge fascia → downgrade
            if (!raggiuntaFascia) {
                console.log('Nessun questionario raggiunge fascia attuale → downgrade');
                await this.downgradePriorita(idPaziente);
            }

            // Ricalcola score finale
            const ultimoValido = await db.query.questionario.findFirst({
                where: and(
                    eq(questionario.idPaziente, idPaziente),
                    eq(questionario.invalidato, false)
                ),
                orderBy: desc(questionario.dataCompilazione),
            });

            if (ultimoValido) {
                await this.scoreService.updatePatientScore(
                    idPaziente,
                    ultimoValido.idQuestionario
                );
            }

            return;
        }

        console.log(`Trovato questionario precedente con cambiamento: ${precedente.id}`);

        // 4. Ricalcola incrementalmente da precedente
        const raggiuntaFascia = await this.ricalcolaScoreIncrementale(
            idPaziente,
            precedente.data,
            precedente.id // AGGIUNTO: passa ID per non resettare il suo cambiamento
        );

        // 5. Se non raggiunge fascia attuale → downgrade
        if (!raggiuntaFascia) {
            console.log('Nessun questionario raggiunge fascia attuale → downgrade');
            await this.downgradePriorita(idPaziente);
        }

        // 6. Ricalcola score finale
        const ultimoValido = await db.query.questionario.findFirst({
            where: and(
                eq(questionario.idPaziente, idPaziente),
                eq(questionario.invalidato, false)
            ),
            orderBy: desc(questionario.dataCompilazione),
        });

        if (ultimoValido) {
            await this.scoreService.updatePatientScore(
                idPaziente,
                ultimoValido.idQuestionario
            );
        }

        console.log('=== INVALIDAZIONE COMPLETATA ===\n');
    }
}
