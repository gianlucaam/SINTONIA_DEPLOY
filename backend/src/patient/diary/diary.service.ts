import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { CreateDiaryPageDto } from './dto/create-diary-page.dto.js';
import { UpdateDiaryPageDto } from './dto/update-diary-page.dto.js';
import { db } from '../../drizzle/db.js';
import { paginaDiario } from '../../drizzle/schema.js';
import { eq, desc, and } from 'drizzle-orm';

@Injectable()
export class DiaryService {
    /**
     * Get all diary pages for a specific patient, ordered by date (most recent first)
     * @param patientId - The UUID of the patient
     * @returns Array of diary pages
     */
    async getDiaryPages(patientId: string): Promise<DiaryPageDto[]> {
        const pages = await db
            .select({
                id: paginaDiario.idPaginaDiario,
                title: paginaDiario.titolo,
                content: paginaDiario.testo,
                createdAt: paginaDiario.dataInserimento,
            })
            .from(paginaDiario)
            .where(eq(paginaDiario.idPaziente, patientId))
            .orderBy(desc(paginaDiario.dataInserimento));

        return pages.map(page => ({
            id: page.id,
            title: page.title,
            content: page.content,
            createdAt: page.createdAt || new Date(),
        }));
    }

    /**
     * Create a new diary page for a patient
     * @param patientId - The UUID of the patient
     * @param dto - Data for the new diary page
     * @returns The created diary page
     */
    async createDiaryPage(patientId: string, dto: CreateDiaryPageDto): Promise<DiaryPageDto> {
        // Create DTO instance and validate
        const dtoInstance = Object.assign(new CreateDiaryPageDto(), dto);
        const validationErrors = dtoInstance.validate();

        if (validationErrors.length > 0) {
            throw new BadRequestException({
                message: 'Errore di validazione',
                errors: validationErrors,
            });
        }

        // Insert the new diary page
        const [insertedPage] = await db
            .insert(paginaDiario)
            .values({
                titolo: dto.title.trim(),
                testo: dto.content.trim(),
                idPaziente: patientId,
            })
            .returning({
                id: paginaDiario.idPaginaDiario,
                title: paginaDiario.titolo,
                content: paginaDiario.testo,
                createdAt: paginaDiario.dataInserimento,
            });

        if (!insertedPage) {
            throw new BadRequestException('Impossibile creare la pagina del diario');
        }

        return {
            id: insertedPage.id,
            title: insertedPage.title,
            content: insertedPage.content,
            createdAt: insertedPage.createdAt || new Date(),
        };
    }

    /**
     * Update an existing diary page for a patient
     * @param patientId - The UUID of the patient
     * @param pageId - The UUID of the diary page to update
     * @param dto - Updated data for the diary page
     * @returns The updated diary page
     */
    async updateDiaryPage(patientId: string, pageId: string, dto: UpdateDiaryPageDto): Promise<DiaryPageDto> {
        // Create DTO instance and validate
        const dtoInstance = Object.assign(new UpdateDiaryPageDto(), dto);
        const validationErrors = dtoInstance.validate();

        if (validationErrors.length > 0) {
            throw new BadRequestException({
                message: 'Errore di validazione',
                errors: validationErrors,
            });
        }

        // Check if the page exists and belongs to the patient
        const existingPage = await db
            .select()
            .from(paginaDiario)
            .where(and(
                eq(paginaDiario.idPaginaDiario, pageId),
                eq(paginaDiario.idPaziente, patientId)
            ))
            .limit(1);

        if (!existingPage || existingPage.length === 0) {
            throw new NotFoundException('Pagina del diario non trovata');
        }

        // Update the diary page
        const [updatedPage] = await db
            .update(paginaDiario)
            .set({
                titolo: dto.title.trim(),
                testo: dto.content.trim(),
            })
            .where(eq(paginaDiario.idPaginaDiario, pageId))
            .returning({
                id: paginaDiario.idPaginaDiario,
                title: paginaDiario.titolo,
                content: paginaDiario.testo,
                createdAt: paginaDiario.dataInserimento,
            });

        if (!updatedPage) {
            throw new BadRequestException('Impossibile aggiornare la pagina del diario');
        }

        return {
            id: updatedPage.id,
            title: updatedPage.title,
            content: updatedPage.content,
            createdAt: updatedPage.createdAt || new Date(),
        };
    }
}

