import { Module } from '@nestjs/common';
import { AdminQuestionariController } from './admin-questionari.controller.js';
import { AdminQuestionariService } from './admin-questionari.service.js';

@Module({
    controllers: [AdminQuestionariController],
    providers: [AdminQuestionariService],
})
export class AdminQuestionariModule { }
