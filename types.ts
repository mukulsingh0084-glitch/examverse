
export type Page = 'Home' | 'Predict' | 'Upload' | 'Tutor' | 'More';

export interface PredictedQuestion {
  question: string;
  confidence: number;
}

export interface PaperAnalysis {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  suggestedMarks: number;
  relatedQuestions: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text?: string;
  imageUrl?: string;
}
