/**
 * DTO per la richiesta di creazione di una nuova pagina del diario
 */
export class CreateDiaryPageDto {
    /**
     * Titolo della pagina del diario (max 64 caratteri)
     */
    title: string;

    /**
     * Contenuto completo della pagina del diario
     */
    content: string;

    /**
     * Valida che i campi rispettino i limiti del database
     */
    validate(): string[] {
        const errors: string[] = [];

        if (!this.title || this.title.trim().length === 0) {
            errors.push('Il titolo è obbligatorio');
        } else if (this.title.length > 64) {
            errors.push('Il titolo non può superare 64 caratteri');
        }

        if (!this.content || this.content.trim().length === 0) {
            errors.push('Il contenuto è obbligatorio');
        }

        return errors;
    }
}

/**
 * DTO per la risposta dopo la creazione di una pagina del diario
 */
export class DiaryPageCreatedDto {
    /**
     * Indica se l'operazione è stata completata con successo
     */
    success: boolean;

    /**
     * UUID della pagina del diario creata
     */
    id: string;

    /**
     * Messaggio di conferma
     */
    message: string;
}
