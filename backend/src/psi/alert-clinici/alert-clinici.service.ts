import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../drizzle/db.js';
import { alertClinico } from '../../drizzle/schema.js';

@Injectable()
export class AlertCliniciService {
    /**
     * Restituisce tutti gli alert clinici non ancora accettati
     * Questi alert sono visibili da tutti gli psicologi
     * @returns Lista di alert non accettati (solo dati della tabella alert_clinico)
     */
    async getAlertNonAccettati() {
        const rows = await db
            .select({
                idAlert: alertClinico.idAlert,
                dataAlert: alertClinico.dataAlert,
                stato: alertClinico.accettato,
            })
            .from(alertClinico)
            .where(eq(alertClinico.accettato, false))
            .orderBy(alertClinico.dataAlert);

        return rows;
    }
}
