import axios from 'axios';

export async function generateTOC(text: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:8000/toc', {
      topic: text
    });
    return response.data.content;
  } catch (error) {
    console.error('Failed to create user:', error);
    return error;
  }
}