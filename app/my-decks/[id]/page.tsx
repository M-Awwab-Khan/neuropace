import Flashcards from "@/components/flashcards-page/flashcards";
import { auth } from "@clerk/nextjs/server";
export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const deckId = (await params).id;

  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();
  return (
    <div>
      <Flashcards userId={userId} deckId={deckId} />
    </div>
  );
}
