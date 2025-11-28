import { Inject, Injectable } from '@nestjs/common';
import { db } from '../../drizzle/db.js';
import { domandaForum, rispostaForum } from '../../drizzle/schema.js';
import { eq } from 'drizzle-orm';
import { ForumQuestionDto } from '../../forum-comune/dto/forum.dto.js';

type DrizzleDB = typeof db;

@Injectable()
export class AdminForumService {
    constructor(@Inject('drizzle') private db: DrizzleDB) { }

    async getAllQuestions() {
        const rows = await this.db
            .select()
            .from(domandaForum)
            .leftJoin(rispostaForum, eq(domandaForum.idDomanda, rispostaForum.idDomanda));

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
