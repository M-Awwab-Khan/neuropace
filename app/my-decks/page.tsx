import Decks from "@/components/decks-page/decks";
import { auth } from "@clerk/nextjs/server";

export default async function MyDecksPage() {
  const { userId } = await auth();
  return (
    <main className="max-w-7xl pt-4 px-4 sm:px-6 lg:px-8 mx-auto mt-6">
      <Decks userId={userId as string} />
    </main>
  );
}
