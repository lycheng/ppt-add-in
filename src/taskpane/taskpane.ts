/* global PowerPoint console */
// apiClient.ts
import axios from 'axios';

export interface ConversationItem {
  role: string
  content: string
  topic?: string
  toc?: string
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