import { Flashcard } from "@/lib/types";
import PublicFlashcards from "@/components/flashcards-page/public-flashcards";
import { getFlashcards } from "@/lib/actions";
export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const deckId = (await params).id;

  const flashcards = (await getFlashcards(deckId)) as Flashcard[];
  return (
    <div>
      <PublicFlashcards deckId={deckId} flashcards={flashcards} />
    </div>
  );
}
