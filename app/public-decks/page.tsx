import { getPublicDecks } from "@/lib/actions";
import DecksList from "@/components/public-decks-page/decks-list";
import { Deck, User } from "@/lib/types";

export default async function MyDecksPage() {
  const decks = (await getPublicDecks()) as (Deck & User)[];
  return (
    <main className="max-w-7xl pt-4 px-4 sm:px-6 lg:px-8 mx-auto my-6">
      <DecksList decks={decks} />
    </main>
  );
}
