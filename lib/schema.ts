import { z } from "zod";

export const createDeckSchema = z.object({
    id: z.string().optional(),
    userId: z.string().optional(),
    name: z.string().min(1, "Deck Name is required"),
    category: z.string().min(1, "Category is required"),
});
