//insert some sample data to the database naming the table decks, first create the table then insert some data
import { db } from "@vercel/postgres"
import { decks } from "@/lib/placeholder-data"

const client = await db.connect()


async function seedDecks() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    await client.sql`
        CREATE TABLE IF NOT EXISTS decks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            category TEXT NOT NULL
        )
    `

    const insertedDecks = await Promise.all(decks.map((deck: any) => {
        return client.sql`
            INSERT INTO decks (name, category)
            VALUES (${deck.name}, ${deck.category})
            RETURNING *
        `
    })
    )

    return insertedDecks;
}

export async function GET() {
    await seedDecks()
    return new Response("Seeded decks");
}
