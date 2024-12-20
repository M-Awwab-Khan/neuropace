import Flashcards from "@/components/flashcards-page/flashcards";
import { Flashcard } from "@/lib/types";
import { getFlashcards } from "@/lib/actions";
import { auth } from "@clerk/nextjs/server";
export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const deckId = (await params).id;

  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();
  const flashcards = (await getFlashcards(deckId)) as Flashcard[];
  return (
    <div>
      <Flashcards userId={userId} deckId={deckId} flashcards={flashcards} />
    </div>
  );
}
