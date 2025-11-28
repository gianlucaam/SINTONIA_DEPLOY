import { Inject, Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum, rispostaForum } from '../../drizzle/schema.js';
import { eq, not, exists, and } from 'drizzle-orm';
import { ForumQuestionDto } from '../../forum-comune/dto/forum.dto.js';

type DrizzleDB = typeof db;

@Injectable()
export class PsiForumService {
    constructor(@Inject('drizzle') private db: DrizzleDB) { }

    async getAllQuestions() {
        const rows = await this.db
            .select()
            .from(domandaForum)
            .leftJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda));

        return this.groupQuestions(rows);
    }

    async getMyAnswers(psiId: string) {
        // Ritorna domande a cui lo psicologo ha risposto
        const myAnsweredQuestionIds = await this.db
            .selectDistinct({ idDomanda: domandaForum.idDomanda })
            .from(domandaForum)
            .innerJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .where(eq(rispostaForum.idPsicologo, psiId));

        if (myAnsweredQuestionIds.length === 0) {
            return [];
        }

        const rows = await this.db
            .select()
            .from(domandaForum)
            .leftJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .where(
                exists(
                    this.db
                        .select()
                        .from(rispostaForum)
                        .where(
                            and(
                                eq(rispostaForum.idDomanda, domandaForum.idDomanda),
                                eq(rispostaForum.idPsicologo, psiId)
                            )
                        )
                )
            );

        return this.groupQuestions(rows);
    }

    async getUnansweredQuestions() {
        // Ritorna domande che non hanno alcuna risposta
        const rows = await this.db
            .select()
            .from(domandaForum)
            .leftJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda))
            .where(
                not(
                    exists(
                        this.db
                            .select()
                            .from(rispostaForum)
                            .where(eq(rispostaForum.idDomanda, domandaForum.idDomanda)),
                    ),
                ),
            );

        return this.groupQuestions(rows);
    }

    private groupQuestions(rows: any[]): ForumQuestionDto[] {
        const map = new Map<string, ForumQuestionDto>();

        for (const row of rows) {
            const q = row.domanda_forum;
            const a = row.risposta_forum;

            if (!map.has(q.idDomanda)) {
                map.set(q.idDomanda, {
                    ...q,
                    risposte: [],
                });
            }

            if (a) {
                const question = map.get(q.idDomanda);
                if (question && question.risposte) {
                    question.risposte.push(a);
                }
            }
        }

        return Array.from(map.values());
    }
}
