import { Controller, Post, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { TermsService } from './terms.service.js';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js';
import { SpidAuthService } from '../../spid-auth/spid-auth.service.js';

@Controller('patient/terms')
export class TermsController {
    constructor(
        private readonly termsService: TermsService,
        private readonly spidAuthService: SpidAuthService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async acceptTerms(@Request() req) {
        try {
            console.log('Accepting terms for user ID:', req.user.id);
            const patient = await this.termsService.acceptTerms(req.user.id);

            if (!patient) {
                console.error('Patient not found for ID:', req.user.id);
                throw new NotFoundException('Paziente non trovato');
            }

            return this.spidAuthService.generateToken(patient);
        } catch (error) {
            console.error('Error accepting terms:', error);
            throw error;
        }
    }
}
