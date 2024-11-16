import FlashcardsSkeleton from "@/components/flashcards-page/flashcards-skeleton";

export default function loading() {
  return (
    <div className="container mx-auto px-8 py-12">
      <FlashcardsSkeleton />
    </div>
  );
}
