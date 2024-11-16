import { z } from "zod";

export const createDeckSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    name: z.string().min(1, "Deck Name is required"),
    category: z.string().min(1, "Category is required"),
});

export const createFlashcardSchema = z.object({
  id: z.string().optional(),
  deckId: z.string(),
  userId: z.string(),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  lastReviewDate: z.string().datetime().optional(),
  interval: z.number().default(1), // Default to 1 if not provided
  repetitions: z.number().default(0), // Default to 0 if not provided
  easeFactor: z.number().default(2.5), // Default to 2.5 if not provided
  nextReviewDate: z.string().datetime().default(() => new Date().toISOString()),
});

export const flashcardsSchema = z.array(createFlashcardSchema);
