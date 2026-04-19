import { Injectable, BadRequestException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY is not set in the environment variables.');
    }
    // Initialize standard generative AI model
    this.genAI = new GoogleGenerativeAI(apiKey || 'MISSING_API_KEY');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async analyzeSymptoms(symptoms: string) {
    if (!process.env.GEMINI_API_KEY) throw new BadRequestException('Gemini API key is not configured on the server.');

    const prompt = `You are an expert AI veterinarian. A pet owner has provided the following symptoms for their pet: 
"${symptoms}"

Please provide a highly professional, structured response containing:
1. Potential Causes: A brief list of what might be happening.
2. Urgency Level: (Low, Medium, High, or Critical)
3. Immediate Actions: What the owner should do right now.
4. Disclaimer: Remind them that this is an AI estimation and they should consult a real vet.

Keep the tone empathetic and clinical. Format as Markdown.`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
       throw new BadRequestException('Failed to analyze symptoms. ' + error.message);
    }
  }

  async summarizeChat(chatHistory: any[]) {
    if (!process.env.GEMINI_API_KEY) throw new BadRequestException('Gemini API key is not configured on the server.');
    
    if (!chatHistory || chatHistory.length === 0) return 'No chat history to summarize.';

    const formattedChat = chatHistory.map(m => `${m.sender.name}: ${m.content}`).join('\n');
    const prompt = `You are a medical assistant for a veterinarian. Summarize the following chat history between a doctor and a pet owner.
Highlight key medical issues discussed, advice given, and next steps.

CHAT LOG:
${formattedChat}`;

    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
       throw new BadRequestException('Failed to summarize chat. ' + error.message);
    }
  }
}
