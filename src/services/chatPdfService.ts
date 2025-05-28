
const CHATPDF_API_KEY = 'sec_efzROEBbCBkO0VSdHuY6TzNpyup86fMU';
const CHATPDF_BASE_URL = 'https://api.chatpdf.com/v1';

export interface ChatPdfSource {
  id: string;
  name: string;
  url?: string;
}

export interface ChatPdfMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatPdfResponse {
  content: string;
  sources?: ChatPdfSource[];
}

class ChatPdfService {
  private sourceId: string | null = null;

  async uploadPdf(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading PDF to ChatPDF API...');

    const response = await fetch(`${CHATPDF_BASE_URL}/sources/add-file`, {
      method: 'POST',
      headers: {
        'x-api-key': CHATPDF_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('PDF upload failed:', error);
      throw new Error(`Failed to upload PDF: ${response.status}`);
    }

    const data = await response.json();
    this.sourceId = data.sourceId;
    console.log('PDF uploaded successfully, sourceId:', this.sourceId);
    
    return this.sourceId;
  }

  async sendMessage(message: string, sourceId?: string): Promise<ChatPdfResponse> {
    if (!sourceId && !this.sourceId) {
      throw new Error('No PDF source available. Please upload a PDF first.');
    }

    const currentSourceId = sourceId || this.sourceId;
    
    console.log('Sending message to ChatPDF API:', message);

    const response = await fetch(`${CHATPDF_BASE_URL}/chats/message`, {
      method: 'POST',
      headers: {
        'x-api-key': CHATPDF_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceId: currentSourceId,
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Chat message failed:', error);
      throw new Error(`Failed to send message: ${response.status}`);
    }

    const data = await response.json();
    console.log('ChatPDF API response:', data);
    
    return {
      content: data.content,
      sources: data.sources || [],
    };
  }

  async deletePdf(sourceId: string): Promise<void> {
    console.log('Deleting PDF from ChatPDF API:', sourceId);

    const response = await fetch(`${CHATPDF_BASE_URL}/sources/delete`, {
      method: 'POST',
      headers: {
        'x-api-key': CHATPDF_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sources: [sourceId],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('PDF deletion failed:', error);
      throw new Error(`Failed to delete PDF: ${response.status}`);
    }

    console.log('PDF deleted successfully');
  }

  setCurrentSourceId(sourceId: string) {
    this.sourceId = sourceId;
  }

  getCurrentSourceId(): string | null {
    return this.sourceId;
  }
}

export const chatPdfService = new ChatPdfService();
