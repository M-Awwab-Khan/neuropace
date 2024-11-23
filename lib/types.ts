export type Deck = {
  id: string;
  userId: string;
  name: string;
  category: string;
  visibility: string;
};

export type Flashcard = {
  id?: string;
  deckId: string;
  userId: string;
  question: string;
  answer: string;
  lastReviewDate?: string;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReviewDate: string;
};

export interface FormType {
  topic: string;
  note: string;
  file: string;
  difficulty: string;
  quizCount: number;
  timer: number;
}

export interface QuizType {
  id: string;
  question: string;
  description: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  answer: string;
  resources: [{ title: string; link: string }];
}
