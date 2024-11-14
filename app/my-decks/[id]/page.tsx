import Flashcards from "@/components/flashcards-page/flashcards";
import { auth } from "@clerk/nextjs/server";
export default async function FlashcardsPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  return (
    <div>
      <Flashcards userId={userId} deckId={params.id} />
    </div>
  );
}
