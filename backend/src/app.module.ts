import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { PsiModule } from './psi/psi.module.js';
import { SpidAuthModule } from './spid-auth/spid-auth.module.js';
import { PatientModule } from './patient/patient.module.js';
import { QuestionnairesModule } from './questionari/questionnaires.module.js';
import { AdminQuestionariModule } from './amministratore/questionari/admin-questionari.module.js';

@Module({
  imports: [AuthModule, DashboardModule, SpidAuthModule, PatientModule, PsiModule, QuestionnairesModule, AdminQuestionariModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

