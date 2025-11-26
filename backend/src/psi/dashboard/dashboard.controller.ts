import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { PsiDashboardResponseDto } from '../dto/psi-dashboard.dto';

@Controller('psi/dashboard')
export class DashboardController {
    constructor(private readonly DashboardService: DashboardService) { }

    /**
     * Endpoint per recuperare i dati della sidebar dello psicologo
     *
     * @param codiceFiscale - Codice Fiscale dello psicologo (es. RSSMRA80A01H501U)
     * @returns Dati dashboard con profilo e contatori notifiche
     */
    @Get('me')
    async getDashboard(
        @Query('cf') codiceFiscale: string,
    ): Promise<PsiDashboardResponseDto> {
        console.log("test" , codiceFiscale);
        return this.DashboardService.getDashboardData(codiceFiscale);
    }
}