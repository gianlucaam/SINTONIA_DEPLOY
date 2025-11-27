/**
 * DTO for questionnaire response
 * Maps to frontend QuestionnaireData interface
 */
export class QuestionnaireResponseDto {
    idQuestionario: string;
    idPaziente: string;
    nomeTipologia: string;
    score: number | null;
    risposte: any; // JSON data
    cambiamento: boolean;
    dataCompilazione: string;
    revisionato: boolean;
    invalidato: boolean;
    noteInvalidazione: string | null;
    dataInvalidazione: string | null;
    idPsicologoRevisione: string | null;
    idPsicologoRichiedente: string | null;
    idAmministratoreConferma: string | null;
}
