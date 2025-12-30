import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventEmitter } from 'events';

export interface AudioChunk {
  data: ArrayBuffer;
  timestamp: number;
}

export class GeminiClient extends EventEmitter {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isConfigured: boolean = false;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey: string, modelName: string = 'gemini-2.0-flash-exp') {
    super();
    this.apiKey = apiKey;
    this.modelName = modelName;
    
    if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.isConfigured = true;
        console.log(`✅ Gemini API configured with model: ${this.modelName}`);
      } catch (error) {
        console.warn('⚠️ Failed to initialize Gemini API:', error);
        this.isConfigured = false;
      }
    } else {
      console.warn('⚠️ Gemini API key not configured. Using simulated mode.');
      this.isConfigured = false;
    }
  }

  /**
   * Send audio chunk to Gemini API for transcription
   * Immediately forwards chunks without buffering
   */
  async sendAudioChunk(audioData: ArrayBuffer): Promise<void> {
    if (!this.isConfigured) {
      // Simulated transcription for demo purposes
      this.emitSimulatedTranscription();
      return;
    }

    try {
      // Convert ArrayBuffer to base64
      const buffer = Buffer.from(audioData);
      const base64Audio = buffer.toString('base64');

      // Initialize model for this session if not already done
      if (!this.model) {
        this.model = this.genAI!.getGenerativeModel({ 
          model: this.modelName 
        });
      }

      // Send audio chunk for transcription
      // Note: Gemini API structure - adjust based on actual API requirements
      const result = await this.model.generateContent([
        {
          inlineData: {
            mimeType: 'audio/webm;codecs=opus',
            data: base64Audio
          }
        },
        { text: 'Transcribe this audio.' }
      ]);

      const response = await result.response;
      const text = response.text();
      
      if (text) {
        this.emit('partial-transcription', text);
      }
    } catch (error: any) {
      console.error('❌ Gemini API error:', error.message);
      this.emit('error', error);
    }
  }

  /**
   * Emit simulated transcription when API is not configured
   */
  private emitSimulatedTranscription(): void {
    const phrases = [
      'Hello ',
      'this is ',
      'a simulated ',
      'transcription. ',
      'Configure GEMINI_API_KEY ',
      'for real-time speech recognition. '
    ];
    
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Emit after a short delay to simulate API response
    setTimeout(() => {
      this.emit('partial-transcription', randomPhrase);
    }, 100);
  }

  /**
   * Reset the model session (useful for new connections)
   */
  resetSession(): void {
    this.model = null;
  }

  /**
   * Check if Gemini API is properly configured
   */
  isApiConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get configuration status for health check
   */
  getStatus(): { configured: boolean; model: string } {
    return {
      configured: this.isConfigured,
      model: this.modelName
    };
  }
}
