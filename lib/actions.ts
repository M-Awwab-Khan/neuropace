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
