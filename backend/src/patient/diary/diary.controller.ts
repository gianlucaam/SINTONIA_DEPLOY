import { Controller, Get, Post, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { DiaryService } from './diary.service.js';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { CreateDiaryPageDto, DiaryPageCreatedDto } from './dto/create-diary-page.dto.js';
import type { Request } from 'express';

@Controller('paziente/diario')
export class DiaryController {
    constructor(private readonly diaryService: DiaryService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getDiaryPages(@Req() req: Request): Promise<DiaryPageDto[]> {
        // Extract patient ID from authenticated user
        const patientId = (req as any).user?.id;
        return this.diaryService.getDiaryPages(patientId);
    }

    /**
     * Create a new diary page
     * POST /paziente/diario
     * 
     * @param req - Request object containing authenticated user data
     * @param dto - Diary page data (title, content)
     * @returns Confirmation with ID of created diary page
     */
    @Post()
    @UseGuards(JwtAuthGuard)
    async createDiaryPage(
        @Req() req: Request,
        @Body() dto: CreateDiaryPageDto
    ): Promise<DiaryPageCreatedDto> {
        // Extract patient ID from authenticated user
        const patientId = (req as any).user?.id;
        return this.diaryService.createDiaryPage(patientId, dto);
    }
}
