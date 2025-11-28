import { Module } from '@nestjs/common';
import { InserimentoDomandaController } from './inserimento_domanda.controller.js';
import { ModificaDomandaController } from './modifica_domanda.controller.js';
import { EliminazioneDomandaController } from './eliminazione_domanda.controller.js';
import { InserimentoDomandaService } from './inserimento_domanda.service.js';
import { ModificaDomandaService } from './modifica_domanda.service.js';
import { EliminazioneDomandaService } from './eliminazione_domanda.service.js';

@Module({
    controllers: [
        InserimentoDomandaController,
        ModificaDomandaController,
        EliminazioneDomandaController
    ],
    providers: [
        InserimentoDomandaService,
        ModificaDomandaService,
        EliminazioneDomandaService
    ],
    exports: [
        InserimentoDomandaService,
        ModificaDomandaService,
        EliminazioneDomandaService
    ],
})
export class ForumModule { }
