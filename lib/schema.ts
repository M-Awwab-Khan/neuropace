import { z } from "zod";

export const createDeckSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    name: z.string().min(1, "Deck Name is required"),
    category: z.string().min(1, "Category is required"),
});

export const createFlashcardSchema = z.object({
    id: z.string().optional(),
    deckId: z.string().optional(),
    userId: z.string().optional(),
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    lastReviewDate: z.date().optional(),
    interval: z.number().optional(),
    repetitions: z.number().optional(),
    easeFactor: z.number().optional(),
    nextReviewDate: z.date().optional(),
});
