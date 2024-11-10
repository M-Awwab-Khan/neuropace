import Decks from "@/components/decks-page/decks";

export default async function MyDecksPage() {
  return (
    <main className="max-w-7xl pt-4 px-4 sm:px-6 lg:px-8 mx-auto mt-6">
      <Decks />
    </main>
  );
}
