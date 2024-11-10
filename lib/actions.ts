'use server'
import { sql } from "@vercel/postgres"
import { createDeckSchema } from "./schema"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getDecks() {
    const { rows } = await sql`SELECT * FROM decks`;
    return rows;
}

export async function createDeck({ name, category}: z.infer<typeof createDeckSchema>) {
    const {rows} = await sql`
        INSERT INTO decks (name, category)
        VALUES (${name}, ${category})
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
