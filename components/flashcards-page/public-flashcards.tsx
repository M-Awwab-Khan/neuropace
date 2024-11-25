"use client";
import { Button } from "@/components/ui/button";
import { Flashcard } from "@/lib/types";
import { useState } from "react";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import NoFlashcardsIllustration from "@/public/noFlashcards.svg";
import { copyDeck } from "@/lib/actions";
import { Loader } from "rsuite";
import { useRouter } from "next/navigation";
const PublicFlashcards = ({
  deckId,
  flashcards,
}: {
  deckId: string;
  flashcards: Flashcard[];
}) => {
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [copying, setCopying] = useState(false);
  const handleFlip = (id: string) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };
  const router = useRouter();
  return (
    <div className="container mx-auto px-8 py-14">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <div className="flex flex-row gap-2">
          <Button
            disabled={copying}
            onClick={async () => {
              setCopying(true);
              await copyDeck(deckId);
              setCopying(false);
              router.push("/my-decks");
            }}
          >
            {!copying ? (
              <>
                <Copy />
                Copy this Deck
              </>
            ) : (
              <>
                {" "}
                <Loader />
                Copying
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6 ">
        {flashcards.map((card: any) => (
          <motion.div
            key={card.id}
            className="relative h-64 cursor-pointer "
            onClick={() => handleFlip(card.id as string)}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full [transform-style:preserve-3d] "
              initial={false}
              animate={{
                rotateY: flippedCards.includes(card.id as string) ? 180 : 0,
              }}
              transition={{
                duration: 0.6,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-card rounded-lg shadow-lg p-6 [backface-visibility:hidden] bg-gradient-to-r from-violet-100 to-blue-100 hover:from-violet-400 hover:to-blue-400 hover:text-white">
                <h3 className="text-lg font-medium mb-4">{card.question}</h3>
                <div className="absolute bottom-4 right-4 flex space-x-2"></div>
              </div>
              <div className="absolute inset-0 w-full h-full bg-primary rounded-lg shadow-lg p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <p className="text-lg text-primary-foreground">{card.answer}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      {flashcards.length === 0 && (
        <div className="flex gap-5 flex-col items-center justify-center mt-10">
          <Image
            src={NoFlashcardsIllustration}
            alt="No decks"
            className="w-[300px] h-[300px]"
          />
          <p className="text-md mt-5">
            This deck doesn't have any flashcards yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicFlashcards;
