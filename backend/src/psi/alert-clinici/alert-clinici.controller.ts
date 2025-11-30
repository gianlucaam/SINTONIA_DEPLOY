import { Controller, Get, UseGuards } from '@nestjs/common';
import { AlertCliniciService } from './alert-clinici.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/clinical-alerts')
export class AlertCliniciController {
    constructor(private readonly alertCliniciService: AlertCliniciService) { }

    /**
     * Endpoint per ottenere tutti gli alert clinici non ancora accettati
     * Accessibile solo agli psicologi autenticati
     * Gli alert sono visibili da tutti gli psicologi (pool condiviso)
     * 
     * @returns Lista di alert non accettati (solo campi tabella alert_clinico)
     * 
     * Esempio risposta:
     * [
     *   {
     *     idAlert: "uuid-123",
     *     dataAlert: "2025-11-30T14:20:00Z",
     *     stato: false
     *   }
     * ]
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('psychologist')
    async getAlertNonAccettati() {
        return this.alertCliniciService.getAlertNonAccettati();
    }
}
