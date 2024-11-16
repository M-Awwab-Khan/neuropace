export type Deck = {
    id: string;
    userId: string;
    name: string;
    category: string;
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
