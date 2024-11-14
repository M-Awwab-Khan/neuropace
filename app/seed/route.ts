//insert some sample data to the database naming the table decks, first create the table then insert some data
import { db } from "@vercel/postgres"
import { decks, flashcards } from "@/lib/placeholder-data"

const client = await db.connect()


async function seedDecks() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    await client.sql`
        CREATE TABLE IF NOT EXISTS decks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL
        )
    `

    // const insertedDecks = await Promise.all(decks.map((deck: any) => {
    //     return client.sql`
    //         INSERT INTO decks (name, category)
    //         VALUES (${deck.name}, ${deck.category})
    //         RETURNING *
    //     `
    // })
    // )

    // return insertedDecks;
}

async function seedFlashcards() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`
    await client.sql`
        CREATE TABLE flashcards (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        deck_id UUID NOT NULL,
        user_id TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        last_review_date DATE,
        interval INT DEFAULT 1,
        repetitions INT DEFAULT 0,
        ease_factor FLOAT DEFAULT 2.5,
        next_review_date DATE
    )`;

    const insertedFlashcards = await Promise.all(
    flashcards.map((flashcard: any) => {
        return client.sql`
            INSERT INTO flashcards (
                id,
                deck_id,
                user_id,
                question,
                answer,
                last_review_date,
                interval,
                repetitions,
                ease_factor,
                next_review_date
            )
            VALUES (
                ${flashcard.id},
                ${flashcard.deck_id},
                ${flashcard.user_id},
                ${flashcard.question},
                ${flashcard.answer},
                ${flashcard.last_review_date},
                ${flashcard.interval},
                ${flashcard.repetitions},
                ${flashcard.ease_factor},
                ${flashcard.next_review_date}
            )
            RETURNING *
        `;
    })

);
return insertedFlashcards;

}

export async function GET() {
    await seedFlashcards()
    return new Response("Seeded flashcards");
}
