import { Injectable, Inject } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema.js';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('drizzle') private db: NodePgDatabase<typeof schema>,
    private jwtService: JwtService,
  ) { }

  async validateUser(email: string, pass: string, role: 'admin' | 'psychologist'): Promise<any> {
    let user: any;
    try {
      if (role === 'admin') {
        const users = await this.db.select().from(schema.amministratore).where(eq(schema.amministratore.email, email));
        user = users[0];
      }

      if (user) {
        const isMatch = await bcrypt.compare(pass, user.pw || user.password);
        if (isMatch) {
          const { password, pw, ...result } = user;
          return result;
        }
      }
    } catch (e) {
      console.error('Error in validateUser:', e);
    }
    return null;
  }

  async validateUserAny(email: string, pass: string): Promise<{ user: any, role: 'admin' | 'psychologist' } | null> {
    // Check Admin
    const admin = await this.validateUser(email, pass, 'admin');
    if (admin) {
      return { user: admin, role: 'admin' };
    }

    // Check Psychologist
    const psychologist = await this.validateUser(email, pass, 'psychologist');
    if (psychologist) {
      return { user: psychologist, role: 'psychologist' };
    }

    return null;
  }

  async login(user: any, role: 'admin' | 'psychologist') {
    const payload = { email: user.email || user.codFiscale, sub: user.email || user.codFiscale, role: role };
    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
