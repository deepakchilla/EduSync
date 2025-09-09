// Summary API service for Cohere integration
import { api } from './api';

export interface SummaryRequest {
  text: string;
  type?: 'standard' | 'quick' | 'detailed';
}

export interface SummaryResponse {
  summary: string;
  type: string;
  originalLength: number;
  summaryLength: number;
}

export interface ResourceSummaryResponse {
  summary: string;
  resourceId: number;
}

class SummaryApiService {
  private baseUrl = '/api/summary';

  /**
   * Generate a summary for the given text
   */
  async generateSummary(request: SummaryRequest): Promise<SummaryResponse> {
    const response = await api.post(`${this.baseUrl}/generate`, request);
    return response.data;
  }

  /**
   * Generate a summary for a specific resource
   */
  async generateResourceSummary(resourceId: number): Promise<ResourceSummaryResponse> {
    const response = await api.post(`${this.baseUrl}/resource/${resourceId}`);
    return response.data;
  }

  /**
   * Check the health of the summary service
   */
  async healthCheck(): Promise<any> {
    const response = await api.get(`${this.baseUrl}/health`);
    return response.data;
  }

  /**
   * Generate a quick summary
   */
  async generateQuickSummary(text: string): Promise<SummaryResponse> {
    return this.generateSummary({ text, type: 'quick' });
  }

  /**
   * Generate a detailed summary
   */
  async generateDetailedSummary(text: string): Promise<SummaryResponse> {
    return this.generateSummary({ text, type: 'detailed' });
  }
}

export const summaryApi = new SummaryApiService();
export default summaryApi;
