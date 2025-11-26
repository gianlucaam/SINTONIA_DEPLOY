import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { ASModule } from '../amministratore/AS.module';
import { DashboardModule as PsiDashboardModule } from '../psi/dashboard/dashboard.module';

@Module({
    imports: [ASModule, PsiDashboardModule], // Import Admin + Psychologist modules to access their services
    controllers: [DashboardController],
    providers: [],
})
export class DashboardModule { }
