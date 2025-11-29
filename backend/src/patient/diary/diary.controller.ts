import { Controller, Get, Post, Patch, UseGuards, Req, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { DiaryService } from './diary.service.js';
import { DiaryPageDto } from './dto/diary-page.dto.js';
import { CreateDiaryPageDto } from './dto/create-diary-page.dto.js';
import { UpdateDiaryPageDto } from './dto/update-diary-page.dto.js';
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

    @Post()
    @UseGuards(JwtAuthGuard)
    async createDiaryPage(
        @Req() req: Request,
        @Body() dto: CreateDiaryPageDto
    ): Promise<DiaryPageDto> {
        // Extract patient ID from authenticated user
        const patientId = (req as any).user?.id;
        return this.diaryService.createDiaryPage(patientId, dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async updateDiaryPage(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() dto: UpdateDiaryPageDto
    ): Promise<DiaryPageDto> {
        // Extract patient ID from authenticated user
        const patientId = (req as any).user?.id;
        return this.diaryService.updateDiaryPage(patientId, id, dto);
    }
}

