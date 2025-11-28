import { Module } from '@nestjs/common';
import { Inserimento_domandaController } from './inserimento_domanda.controller.js';
import { Inserimento_domandaService } from './inserimento_domanda.service.js';

@Module({
    controllers: [Inserimento_domandaController],
    providers: [Inserimento_domandaService],
    exports: [Inserimento_domandaService],
})
export class ForumModule { }
