import { Module } from '@nestjs/common';
import { Visualizzazione_pazienti_amministratoreController } from './visualizzazione_pazienti_amministratore.controller.js';
import { Visualizzazione_pazienti_amministratoreService } from './visualizzazione_pazienti_amministratore.service.js';

@Module({
    controllers: [Visualizzazione_pazienti_amministratoreController],
    providers: [Visualizzazione_pazienti_amministratoreService],
})
export class Pazienti_amministratoreModule { }
