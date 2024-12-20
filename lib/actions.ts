"use server";
import { sql } from "@vercel/postgres";
import { createDeckSchema } from "./schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { Flashcard } from "./types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getDecks() {
  const { userId } = await auth();
  const { rows } = await sql`SELECT * FROM decks WHERE user_id = ${userId}`;
  return rows;
}

export async function createDeck({
  userId,
  name,
  category,
  visibility,
}: z.infer<typeof createDeckSchema>) {
  const owner = await currentUser();
  if (!owner) throw new Error("User not found");
  await sql`INSERT INTO users ("userId", "email", "firstName", "lastName", "username") VALUES (${owner.id}, ${owner.emailAddresses[0].emailAddress}, ${owner.firstName}, ${owner.lastName}, ${owner.username}) ON CONFLICT DO NOTHING`;
  const { rows } = await sql`
        INSERT INTO decks (user_id, name, category, visibility)
        VALUES (${userId}, ${name}, ${category}, ${visibility})
        RETURNING *
    `;
  revalidatePath("/my-decks");
  revalidatePath("/public-decks");
  return rows[0];
}

export async function getDeckLastReviewDate(deckId: string) {
  const { rows } = await sql`
    SELECT MAX("lastReviewDate") FROM flashcards
    WHERE "deckId" = ${deckId}
  `;
  return rows[0].max;
}

export async function updateDeck(
  id: string,
  { name, category, visibility }: z.infer<typeof createDeckSchema>
) {
  const { rows } = await sql`
    UPDATE decks
    SET name = ${name}, category = ${category}, visibility = ${visibility}
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
  revalidatePath("/my-decks");
  revalidatePath("/public-decks");
}

export async function getFlashcards(deckId: string) {
  const { rows } = await sql`
    SELECT * FROM flashcards
    WHERE "deckId" = ${deckId}
  `;
  return rows;
}

export async function createFlashcard(deckId: string, flashcard: Flashcard) {
  const { userId } = await auth();
  const { rows } = await sql`
    INSERT INTO flashcards ("deckId", "userId", "question", "answer", "nextReviewDate", "lastReviewDate", "interval", "repetitions", "easeFactor")
    VALUES (${deckId}, ${userId}, ${flashcard.question}, ${flashcard.answer}, ${flashcard.nextReviewDate}, ${flashcard.lastReviewDate}, ${flashcard.interval}, ${flashcard.repetitions}, ${flashcard.easeFactor})
    RETURNING *
  `;
  revalidatePath(`/my-decks/${deckId}`);
  return rows[0];
}

export async function updateFlashcard(
  id: string,
  { question, answer }: { question: string; answer: string }
) {
  const { rows } = await sql`
    UPDATE flashcards
    SET question = ${question}, answer = ${answer}
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function updateCompleteFlashcard(flashcard: Flashcard) {
  const { rows } = await sql`
    UPDATE flashcards
    SET question = ${flashcard.question}, answer = ${flashcard.answer}, "lastReviewDate" = ${flashcard.lastReviewDate}, "interval" = ${flashcard.interval}, "repetitions" = ${flashcard.repetitions}, "easeFactor" = ${flashcard.easeFactor}, "nextReviewDate" = ${flashcard.nextReviewDate}
    WHERE id = ${flashcard.id}
    RETURNING *
  `;
  return rows[0];
}

export async function deleteFlashcard(id: string) {
  await sql`
    DELETE FROM flashcards
    WHERE id=${id}`;
}

export async function getAllDecksDetails() {
  const { userId } = await auth();
  const { rows } = await sql`
        SELECT
            d.*,
            COALESCE(rp.progress, 100) as progress,
            lr.last_review_date
        FROM decks d
        LEFT JOIN (
            SELECT
                "deckId",
                ROUND(
                    (COUNT(*) - COUNT(*) FILTER (WHERE "nextReviewDate" <= NOW())) * 100.0 / NULLIF(COUNT(*), 0)
                )::numeric AS progress
            FROM flashcards
            GROUP BY "deckId"
        ) rp ON d.id = rp."deckId"
        LEFT JOIN (
            SELECT
                "deckId",
                MAX("lastReviewDate") as last_review_date
            FROM flashcards
            GROUP BY "deckId"
        ) lr ON d.id = lr."deckId"
        WHERE d.user_id = ${userId}`;
  return rows;
}

export async function getReviewFlashcards(deckId: string) {
  const { rows } = await sql`
    SELECT * FROM flashcards
    WHERE "nextReviewDate" <= NOW() AND "deckId" = ${deckId}
  `;
  return rows;
}

export async function superMemo2(
  repetitions: number,
  interval: number,
  easeFactor: number,
  grade: number
) {
  // Talha

  if (grade >= 3) {
    // Easy & Medium
    if (repetitions == 0) {
      interval = 1;
    } else if (repetitions == 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Talha

  // if (grade < 3) {
  // 	repetitions = 0;
  // 	interval = 0;
  // } else {
  // 	interval = repetitions === 0 ? 1 : repetitions === 1 ? 6 : Math.round(interval * easeFactor);
  // 	repetitions++;
  // }

  // console.log("super memo before", easeFactor);

  // easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  // if (easeFactor < 1.3) {
  // 	easeFactor = 1.3;
  // }

  // console.log("super memo wala", easeFactor);

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    repetitions,
    interval,
    easeFactor,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}

export async function updateReviewFlashcard({
  id,
  repetitions,
  interval,
  easeFactor,
  nextReviewDate,
  lastReviewDate,
}: Partial<Flashcard>) {
  console.log(easeFactor);
  const { rows } = await sql`
    UPDATE flashcards
    SET
      "lastReviewDate" = COALESCE(NOW(), ${lastReviewDate}),
      "repetitions" = COALESCE(${repetitions}, "repetitions"),
      "interval" = COALESCE(${interval}, "interval"),
      "easeFactor" = COALESCE(${easeFactor}, "easeFactor"),
      "nextReviewDate" = COALESCE(${nextReviewDate}, "nextReviewDate")
    WHERE id = ${id}
    RETURNING *
  `;
  return rows[0];
}

export async function createFlashcards(
  deckId: string,
  flashcards: Flashcard[]
) {
  const { rows } = await sql.query(
    `INSERT INTO flashcards ("userId", "deckId", "question", "answer", "nextReviewDate") SELECT "userId", "deckId", "question", "answer", "nextReviewDate" FROM json_populate_recordset(NULL::flashcards, $1) RETURNING *`,
    [JSON.stringify(flashcards)]
  );
  return rows;
}

export async function allDecksReviewProgress() {
  const { rows } = await sql`
        SELECT
            "deckId",
            CASE
                WHEN COUNT(*) = 0 THEN 100
                ELSE ROUND(
                    (COUNT(*) - COUNT(*) FILTER (WHERE "nextReviewDate" <= NOW())) * 100.0 / COUNT(*)
                )::numeric
            END AS "progress"
        FROM flashcards
        GROUP BY "deckId"
    `;
  return rows;
}

export async function getFlashcardsbyDeck(deckIds: any) {
  const { rows } = await sql`
        SELECT * FROM flashcards WHERE "deckId" = ANY(${deckIds})
    `;
  return rows;
}

export async function searchPublicDecks(query: string) {
  const { rows } = await sql`
        SELECT * FROM decks
        WHERE visibility = 'public' AND name ILIKE ${"%" + query + "%"}
    `;
  return rows;
}

export async function copyDeck(originalDeckId: string) {
  const { userId } = await auth();
  if (!userId) return redirect("/login");
  const originalDeck = await sql`
        SELECT * FROM decks WHERE id = ${originalDeckId} AND visibility = 'public';
    `;
  if (!originalDeck) throw new Error("Deck not found or not public.");
  console.log(originalDeck.rows);
  const newDeck = await sql`
        INSERT INTO decks (user_id, name, category, visibility)
        VALUES (${userId}, ${originalDeck.rows[0].name}, ${originalDeck.rows[0].category}, 'private')
        RETURNING id;
    `;

  const newDeckId = newDeck.rows[0].id;

  await sql`
        INSERT INTO flashcards ("userId", "deckId", question, answer, "nextReviewDate", "lastReviewDate")
        SELECT ${userId}, ${newDeckId}, question, answer, "nextReviewDate", "lastReviewDate"
        FROM flashcards
        WHERE "deckId" = ${originalDeckId};
    `;

  return newDeckId;
}

export async function getPublicDecks() {
  const { rows } = await sql`
        SELECT d.*, u."firstName", u."lastName", u."username"
        FROM decks d
        LEFT JOIN users u ON d.user_id = u."userId"
        WHERE d.visibility = 'public'
    `;
  console.log(rows);
  return rows;
}
