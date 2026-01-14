
export interface HomeRequirements {
  type?: string;
  floors?: string;
  style?: string;
  zones?: string[];
  interior?: string;
  materials?: string[];
  mood?: string;
  budget?: string;
  timeframe?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Visualization {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export type AppStatus = 'discovery' | 'briefing' | 'generating' | 'visualized';

export interface AppState {
  messages: ChatMessage[];
  requirements: HomeRequirements;
  visualizations: Visualization[];
  status: AppStatus;
  isGenerating: boolean;
}
