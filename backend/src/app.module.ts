import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { PatientModule } from './patient/patient.module.js';
import { DiaryModule } from './diary/diary.module';

@Module({
  imports: [AuthModule, PatientModule, DiaryModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
