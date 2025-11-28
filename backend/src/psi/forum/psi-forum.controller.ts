import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PsiForumService } from './psi-forum.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { RolesGuard } from '../../auth/roles.guard.js';
import { Roles } from '../../auth/roles.decorator.js';

@Controller('psi/forum')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('psychologist')
export class PsiForumController {
    constructor(private readonly forumService: PsiForumService) { }

    @Get('all')
    // Ritorna tutte le domande
    async getAllQuestions() {
        return this.forumService.getAllQuestions();
    }

    @Get('my-answers')
    // Ritorna domande a cui lo psicologo ha risposto
    async getMyAnswers(@Request() req) {
        return this.forumService.getMyAnswers(req.user.id);
    }

    @Get('unanswered')
    // Ritorna domande che non hanno alcuna risposta
    async getUnansweredQuestions() {
        return this.forumService.getUnansweredQuestions();
    }
}
