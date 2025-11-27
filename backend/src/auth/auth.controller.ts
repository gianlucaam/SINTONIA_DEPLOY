import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body: any) {
    console.log('Login request received:', body);
    const { email, password } = body;
    try {
      const result = await this.authService.validateUserAny(email, password);
      console.log('Validation result:', result ? 'Success' : 'Failure');

      if (!result) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.authService.login(result.user, result.role);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }



  @Get('reset-admin')
  async resetAdminPassword() {
    return this.authService.resetAdminPassword();
  }
}
