'use server'
import { sql } from "@vercel/postgres"

export async function getDecks() {
    const { rows } = await sql`SELECT * FROM decks`
    return rows
}

export async function createDeck(formData: FormData) {
    const { rows } = await sql`
        INSERT INTO decks (name, category)
        VALUES (${formData.get('title')}, ${formData.get('category')})
        RETURNING *
    `
    return rows[0]

}
