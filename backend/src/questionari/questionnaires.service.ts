import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../drizzle/db.js';
import { questionario } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto.js';

@Injectable()
export class QuestionnairesService {
    /**
     * Get single questionnaire by ID
     * @param id - UUID of the questionnaire
     * @returns QuestionnaireResponseDto
     */
    async getQuestionnaireById(id: string): Promise<QuestionnaireResponseDto> {
        const result = await db.query.questionario.findFirst({
            where: eq(questionario.idQuestionario, id),
        });

        if (!result) {
            throw new NotFoundException(`Questionario con ID ${id} non trovato`);
        }

        // Map database result to DTO
        return {
            idQuestionario: result.idQuestionario,
            idPaziente: result.idPaziente,
            nomeTipologia: result.nomeTipologia,
            score: result.score,
            risposte: result.risposte,
            cambiamento: result.cambiamento ?? false,
            dataCompilazione: result.dataCompilazione.toISOString(),
            revisionato: result.revisionato ?? false,
            invalidato: result.invalidato ?? false,
            noteInvalidazione: result.noteInvalidazione,
            dataInvalidazione: result.dataInvalidazione?.toISOString() ?? null,
            idPsicologoRevisione: result.idPsicologoRevisione,
            idPsicologoRichiedente: result.idPsicologoRichiedente,
            idAmministratoreConferma: result.idAmministratoreConferma,
        };
    }
}
