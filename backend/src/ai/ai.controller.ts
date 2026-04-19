import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Roles('USER', 'DOCTOR')
  @Post('analyze-symptoms')
  async analyzeSymptoms(@Body('symptoms') symptoms: string) {
    const analysis = await this.aiService.analyzeSymptoms(symptoms);
    return { result: analysis };
  }

  @Roles('DOCTOR')
  @Post('summarize-chat')
  async summarizeChat(@Body('chatHistory') chatHistory: any[]) {
    const summary = await this.aiService.summarizeChat(chatHistory);
    return { result: summary };
  }
}
