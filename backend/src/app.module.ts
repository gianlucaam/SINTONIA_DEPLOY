import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { SpidAuthModule } from './spid-auth/spid-auth.module.js';
import { PatientModule } from './patient/patient.module.js';

@Module({
  imports: [AuthModule, SpidAuthModule, PatientModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
