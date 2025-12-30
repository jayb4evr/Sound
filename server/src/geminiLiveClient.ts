import { EventEmitter } from 'events';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini Live API Client
 * Uses Gemini 2.0 Flash model with multimodal live streaming
 * Supports real-time audio input and transcription output
 */
export class GeminiLiveClient extends EventEmitter {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private session: any = null;
  private isSimulated: boolean = false;
  private simulatedTextIndex: number = 0;
  private simulatedTexts: string[] = [
    'Hello, this is a simulated transcription. ',
    'The Gemini API is not configured. ',
    'Please set the GEMINI_API_KEY environment variable. ',
    'For now, enjoy this demo mode. ',
    'The visualizer should still work perfectly! '
  ];

  constructor() {
    super();
  }

  /**
   * Initialize Gemini Live API connection
   */
  async initialize(): Promise<void> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('[Gemini] API key not configured. Running in simulated mode.');
      this.isSimulated = true;
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      
      // Use Gemini 2.0 Flash model with multimodal live capabilities
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp'
      });

      console.log('[Gemini] Client initialized with live API');
    } catch (error) {
      console.error('[Gemini] Failed to initialize:', error);
      console.warn('[Gemini] Falling back to simulated mode');
      this.isSimulated = true;
    }
  }

  /**
   * Send audio chunk to Gemini Live API
   * Audio format: 16-bit PCM, 16kHz mono
   * Chunks are sent immediately without buffering
   */
  async sendAudioChunk(audioData: ArrayBuffer): Promise<void> {
    if (this.isSimulated) {
      // Simulate transcription with random text
      if (Math.random() > 0.9) { // Send text occasionally
        const text = this.simulatedTexts[this.simulatedTextIndex % this.simulatedTexts.length];
        this.simulatedTextIndex++;
        this.emit('partial-transcription', text);
      }
      return;
    }

    try {
      // Convert ArrayBuffer to base64 for Gemini API
      const base64Audio = Buffer.from(audioData).toString('base64');

      // Send to Gemini with multimodal input
      const result = await this.model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            inlineData: {
              mimeType: 'audio/pcm',
              data: base64Audio
            }
          }, {
            text: 'Transcribe this audio chunk:'
          }]
        }]
      });

      const response = await result.response;
      const text = response.text();

      if (text && text.trim()) {
        this.emit('partial-transcription', text);
      }
    } catch (error) {
      console.error('[Gemini] Error sending audio chunk:', error);
      this.emit('error', error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Close the Gemini Live session
   */
  async close(): Promise<void> {
    if (this.session) {
      try {
        // Close any active session
        this.session = null;
      } catch (error) {
        console.error('[Gemini] Error closing session:', error);
      }
    }
    this.removeAllListeners();
  }
}
