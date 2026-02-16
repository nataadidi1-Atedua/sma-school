
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

export class SchoolAIService {
  /**
   * Complex Text Tasks (e.g., advanced reasoning, coding, math, and STEM) use 'gemini-3-pro-preview'
   */
  async getAcademicInsight(prompt: string, language: Language = 'en') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Language-specific system instructions
    const langNames: Record<Language, string> = {
      en: 'English', 
      pt: 'Portuguese', 
      es: 'Spanish', 
      fr: 'French', 
      zh: 'Chinese', 
      ja: 'Japanese',
      ru: 'Russian',
      de: 'German',
      it: 'Italian',
      ar: 'Arabic'
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are an expert School Administrator Assistant for School Manager Academy (SM@). 
          You provide helpful, data-driven advice on school management, student performance, and finances. 
          IMPORTANT: You must always respond in ${langNames[language]}.`,
        }
      });
      // response.text property (getter)
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error processing request.";
    }
  }

  /**
   * Basic Text Tasks (summarization) use 'gemini-3-flash-preview'
   */
  async generateReportSummary(data: any, language: Language = 'en') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Based on the school data, provide a 3-sentence summary in ${language}: ${JSON.stringify(data)}`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Summarize school administrative data accurately and concisely."
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Error generating summary.";
    }
  }

  /**
   * Basic Text Tasks (simple generation) use 'gemini-3-flash-preview'
   */
  async draftEmailNotification(subject: string, detail: string, language: Language = 'pt') {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Redija um e-mail formal e atencioso da secretaria acadêmica para os alunos. 
    Assunto: ${subject}. 
    Detalhe da Mudança: ${detail}.
    Por favor, use um tom profissional e acolhedor.`;
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Você é um assistente administrativo escolar especializado em comunicações formais."
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Erro ao redigir e-mail.";
    }
  }
}

export const aiService = new SchoolAIService();
