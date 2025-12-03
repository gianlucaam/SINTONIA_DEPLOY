import { Module } from '@nestjs/common';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { QuestionariModule } from './questionari/questionari.module.js';
import { PsiForumModule } from './forum/psi-forum.module.js';
import { PazientiModule } from './pazienti/pazienti.module.js';
import { PsiAreaPersonaleModule } from './area-personale/area-personale.module.js';
import { AlertCliniciModule } from './alert-clinici/alert-clinici.module.js';
import { ReportModule } from './report/report.module.js';

@Module({
    imports: [DashboardModule, QuestionariModule, PazientiModule, PsiForumModule, PsiAreaPersonaleModule, AlertCliniciModule, ReportModule],
})
export class PsiModule { }