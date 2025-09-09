// Cohere API service for text summarization
import axios from 'axios';

const COHERE_API_BASE_URL = 'https://api.cohere.ai/v1';

interface CohereGenerateRequest {
  model: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  k?: number;
  p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  end_sequences?: string[];
  stop_sequences?: string[];
}

interface CohereGenerateResponse {
  id: string;
  generations: Array<{
    id: string;
    text: string;
    finish_reason: string;
  }>;
  meta: {
    api_version: {
      version: string;
    };
    billed_units: {
      input_tokens: number;
      output_tokens: number;
    };
  };
}

class CohereApiService {
  private apiKey: string;

  constructor() {
    // Get API key from environment variables
    this.apiKey = import.meta.env.VITE_COHERE_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('Cohere API key not found. Please set VITE_COHERE_API_KEY in your environment variables.');
    }
  }

  /**
   * Generate a summary of the given text using Cohere's generate endpoint
   */
  async generateSummary(text: string, options?: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
  }): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Cohere API key is not configured');
    }

    try {
      // Truncate text if it's too long (Cohere has token limits)
      const maxInputLength = 4000; // Approximate token limit
      const truncatedText = text.length > maxInputLength 
        ? text.substring(0, maxInputLength) + '...' 
        : text;

      const prompt = `Please provide a comprehensive summary of the following educational material. Focus on key concepts, main points, and important details that would help students understand the content:\n\n${truncatedText}\n\nSummary:`;

      const requestData: CohereGenerateRequest = {
        model: options?.model || 'command',
        prompt: prompt,
        max_tokens: options?.maxTokens || 500,
        temperature: options?.temperature || 0.3,
        k: 0,
        p: 0.75,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop_sequences: ['---', '\n\n---']
      };

      const response = await axios.post<CohereGenerateResponse>(
        `${COHERE_API_BASE_URL}/generate`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      if (response.data.generations && response.data.generations.length > 0) {
        return response.data.generations[0].text.trim();
      } else {
        throw new Error('No summary generated');
      }

    } catch (error: any) {
      console.error('Cohere API Error:', error);
      
      if (error.response) {
        // API responded with error status
        const status = error.response.status;
        const message = error.response.data?.message || error.response.statusText;
        
        switch (status) {
          case 401:
            throw new Error('Invalid Cohere API key');
          case 429:
            throw new Error('Rate limit exceeded. Please try again later.');
          case 400:
            throw new Error(`Bad request: ${message}`);
          case 500:
            throw new Error('Cohere API server error. Please try again later.');
          default:
            throw new Error(`API error (${status}): ${message}`);
        }
      } else if (error.request) {
        // Network error
        throw new Error('Network error. Please check your internet connection.');
      } else {
        // Other error
        throw new Error(error.message || 'Unknown error occurred');
      }
    }
  }

  /**
   * Generate a quick summary (shorter version)
   */
  async generateQuickSummary(text: string): Promise<string> {
    return this.generateSummary(text, {
      maxTokens: 200,
      temperature: 0.2,
      model: 'command'
    });
  }

  /**
   * Generate a detailed summary (longer version)
   */
  async generateDetailedSummary(text: string): Promise<string> {
    return this.generateSummary(text, {
      maxTokens: 800,
      temperature: 0.4,
      model: 'command'
    });
  }

  /**
   * Check if the API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }
}

// Export a singleton instance
export const cohereApi = new CohereApiService();
export default cohereApi;
