"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Delete } from "lucide-react";
import { getFlashcards } from "@/lib/actions";
import CreateFlashcard from "./create-flashcard";
import EditFlashcard from "./edit-flashcard";
import { Flashcard } from "@/lib/types";
import DeleteFlashcard from "./delete-flashcard";
import NoFlashcardsIllustration from "@/public/noFlashcards.svg";
import { FlashcardsUploader } from "./upload-flashcards";
import Image from "next/image";
import FlashcardReview from "./review-flashcards";
import { BookOpen } from "lucide-react";
import FlashcardsSkeleton from "./flashcards-skeleton";

export default function Flashcards({
  userId,
  deckId,
}: {
  userId: string;
  deckId: string;
}) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      setIsLoading(true);
      const flashcards = (await getFlashcards(deckId)) as Flashcard[];
      setFlashcards(flashcards);
      setIsLoading(false);
    };
    fetchFlashcards();
  }, []);

  const handleFlip = (id: string) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleSaveEdit = (updatedCard: Flashcard) => {
    setFlashcards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  };

  const handleCreateCard = (newCard: Flashcard) => {
    setFlashcards((prev) => [...prev, { ...newCard }]);
  };

  const handleFlashcardUpload = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const newFlashcards = JSON.parse(content) as Flashcard[];
      setFlashcards((prev) => [...prev, ...newFlashcards]);
    };
    reader.readAsText(file);
  }

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <div className="flex flex-row gap-2">
          <FlashcardReview
            deckId={deckId}
            latestFlashcards={flashcards}
            trigger={
              <Button className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" /> Review Flashcards
              </Button>
            }
          />
          <CreateFlashcard
            deckId={deckId}
            onFlashcardCreated={handleCreateCard}
            trigger={
              <Button className="flex items-center">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
          <FlashcardsUploader onUpload={handleFlashcardUpload} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashcards.map((card) => (
          <motion.div
            key={card.id}
            className="relative h-64 cursor-pointer"
            onClick={() => handleFlip(card.id)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full [transform-style:preserve-3d]"
              initial={false}
              animate={{ rotateY: flippedCards.includes(card.id) ? 180 : 0 }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-card rounded-lg shadow-lg p-6 [backface-visibility:hidden]">
                <h3 className="text-lg font-medium mb-4 text-card-foreground">
                  {card.question}
                </h3>
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <EditFlashcard
                    flashcard={card}
                    onFlashcardUpdated={handleSaveEdit}
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    }
                  />
                  <DeleteFlashcard
                    flashcard={card}
                    onFlashcardDelete={handleDelete}
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    }
                  />
                </div>
              </div>
              <div className="absolute inset-0 w-full h-full bg-primary rounded-lg shadow-lg p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <p className="text-lg text-primary-foreground">{card.answer}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      {isLoading && <FlashcardsSkeleton />}
      {flashcards.length === 0 && !isLoading && (
        <div className="flex gap-5 flex-col items-center justify-center mt-10">
          <Image
            src={NoFlashcardsIllustration}
            alt="No decks"
            className="w-[300px] h-[300px]"
          />
          <p className="text-md mt-5">You don't have any decks yet</p>
          <CreateFlashcard
            deckId={deckId}
            onFlashcardCreated={handleCreateCard}
            trigger={
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Create Flashcard
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
