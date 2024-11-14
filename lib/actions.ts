'use server'
import { sql } from "@vercel/postgres"
import { createDeckSchema } from "./schema"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { auth, currentUser } from "@clerk/nextjs/server"

export async function getDecks() {
    const { userId } = await auth();
    const { rows } = await sql`SELECT * FROM decks WHERE user_id = ${userId}`;
    return rows;
}

export async function createDeck({ userId, name, category}: z.infer<typeof createDeckSchema>) {
    const {rows} = await sql`
        INSERT INTO decks (user_id, name, category)
        VALUES (${userId}, ${name}, ${category})
        RETURNING *
    `;
    revalidatePath("/my-decks");
    return rows[0];
}

export async function updateDeck(id: string, { name, category }: z.infer<typeof createDeckSchema>) {
  const { rows } = await sql`
    UPDATE decks
    SET name = ${name}, category = ${category}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function deleteDeck(id: string) {
  await sql`
    DELETE FROM decks
    WHERE id = ${id}
  `;
}

export async function getFlashcards(deckId: string) {
  const { rows } = await sql`
    SELECT * FROM flashcards
    WHERE deck_id = ${deckId}
  `;
  return rows;
}

export async function createFlashcard(deckId: string, { question, answer }: { question: string; answer: string }) {
    const { userId } = await auth();
  const { rows } = await sql`
    INSERT INTO flashcards (deck_id, user_id, question, answer)
    VALUES (${deckId}, ${userId}, ${question}, ${answer})
    RETURNING *
  `;
  revalidatePath(`/my-decks/${deckId}`);
  return rows[0];
}


export async function updateFlashcard(id: string, { question, answer }: { question: string; answer: string }) {
  const { rows } = await sql`
    UPDATE flashcards
    SET question = ${question}, answer = ${answer}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}
