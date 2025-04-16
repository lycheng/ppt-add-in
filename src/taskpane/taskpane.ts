/* global PowerPoint console */
// apiClient.ts
import axios from 'axios';

export interface ConversationItem {
  role: string
  content: string
  intent?: string
  topic?: string
  toc?: string
}

export interface IntentResponse {
  confident: number
  follow_up: string
  intent: string
}

export async function postIntent(query: string): Promise<IntentResponse> {
  try {
    const response = await axios.post('http://localhost:8000/intent', {
      query: query 
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    return error;
  }
}

export async function postChat(items: ConversationItem[]): Promise<ConversationItem[]> {
  try {
    const response = await axios.post('http://localhost:8000/chat', {
      history: items
    });
    return response.data.history;
  } catch (error) {
    console.error('Failed to create user:', error);
    return error;
  }
}

export async function generatePPTBase64(content: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:8000/ppt/generate', {
      content: content
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    return error;
  }
}