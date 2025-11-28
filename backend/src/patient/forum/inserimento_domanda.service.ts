import { Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum } from '../../drizzle/schema.js';
import { InserisciDomandaDto, DomandaInseritaDto } from './dto/inserimento_domanda.dto.js';

@Injectable()
export class Inserimento_domandaService {
    /**
     * Inserisce una nuova domanda nel forum
     * @param idPaziente - ID del paziente che crea la domanda
     * @param dto - Dati della domanda (titolo, testo, categoria)
     * @returns Conferma inserimento con ID della domanda creata
     */
    async inserisciDomanda(
        idPaziente: string,
        dto: InserisciDomandaDto
    ): Promise<DomandaInseritaDto> {
        // Inserimento nella tabella domanda_forum
        const inserted = await db
            .insert(domandaForum)
            .values({
                idPaziente,
                titolo: dto.titolo,
                testo: dto.testo,
                categoria: dto.categoria,
                // dataInserimento viene generato automaticamente dal database
            })
            .returning({ id: domandaForum.idDomanda });

        const idDomanda = inserted[0]?.id;

        if (!idDomanda) {
            throw new Error('Impossibile inserire la domanda nel forum');
        }

        return {
            success: true,
            idDomanda,
            message: 'Domanda pubblicata con successo nel forum',
        };
    }
}
