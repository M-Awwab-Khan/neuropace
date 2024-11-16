"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flashcard } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { BookOpen, CircleCheckBig } from "lucide-react";
import {
  getReviewFlashcards,
  updateReviewFlashcard,
  superMemo2,
} from "@/lib/actions";
// import { MinPriorityQueue } from "datastructures-js";
import MinPriorityQueue from "@/lib/DataStructures/MinPriorityQueue";

interface FlashcardReviewProps {
  deckId: string;
  trigger: React.ReactNode;
  latestFlashcards: Flashcard[];
}

const compare = (a: Flashcard, b: Flashcard) => {
  return (
    new Date(a.nextReviewDate).getTime() < new Date(b.nextReviewDate).getTime()
  );
};

export default function FlashcardReview({
  deckId,
  latestFlashcards,
  trigger,
}: FlashcardReviewProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReviewCardFlipped, setIsReviewCardFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [priorityQueue, setPriorityQueue] = useState<
    MinPriorityQueue<Flashcard>
  >(new MinPriorityQueue(compare));
  const originalFlashcardCount = latestFlashcards.length;

  useEffect(() => {
    const fetchFlashcards = async () => {
      const fetchedFlashcards = (await getReviewFlashcards(
        deckId
      )) as Flashcard[];

      setPriorityQueue(MinPriorityQueue.fromArray(fetchedFlashcards, compare));

      console.log(priorityQueue);
    };
    fetchFlashcards();
    setCurrentCard(priorityQueue?.front());
  }, [deckId, latestFlashcards]);

  const handleDifficultySelection = async (difficulty: number) => {
    console.log("I am clicked");
    if (!priorityQueue?.size()) return;

    const dequeuedCard = priorityQueue?.dequeue();
    setCurrentCard(priorityQueue?.front());
    const { repetitions, interval, easeFactor, nextReviewDate } =
      await superMemo2(
        dequeuedCard.repetitions,
        dequeuedCard.interval,
        dequeuedCard.easeFactor,
        difficulty
      );

    const updatedFlashcard = {
      ...dequeuedCard,
      repetitions,
      interval,
      easeFactor,
      nextReviewDate,
    };
    await updateReviewFlashcard(updatedFlashcard);
    setIsReviewCardFlipped(false);
  };

  const handleReviewFlip = () => {
    setIsReviewCardFlipped(!isReviewCardFlipped);
  };

  //console.log(priorityQueue, "AA");
  console.log(priorityQueue?.size());
  console.log(priorityQueue?.size() === 0);
  const isReviewComplete = priorityQueue?.size() === 0;

  const reviewProgress =
    originalFlashcardCount > 0
      ? ((originalFlashcardCount - priorityQueue?.size()) /
          originalFlashcardCount) *
        100
      : 100;

  return (
    <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
      <DialogTrigger asChild>
        <div className="relative inline-block">
          {trigger}
          <div className="absolute top-0 right-0 -mt-2 -mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-secondary-foreground text-xs">
            {priorityQueue.size()}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review Flashcards</DialogTitle>
          <DialogDescription>
            Review your flashcards and rate their difficulty.
          </DialogDescription>
        </DialogHeader>
        {isReviewComplete ? (
          <div className="flex flex-col items-center justify-center m-3">
            <div className="flex flex-row m-3">
              <CircleCheckBig size={28} className="text-primary mr-2" />
              <p className="text-center text-foreground">
                You've reviewed all the flashcards in this set.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <Progress value={reviewProgress} className="w-full mb-4" />
            <p className="text-center text-sm text-muted-foreground mb-4">
              {originalFlashcardCount - priorityQueue.size()} of{" "}
              {originalFlashcardCount} cards reviewed
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                className="inset-0 w-full h-[300px] cursor-pointer"
                onClick={handleReviewFlip}
                initial={false}
                animate={{ rotateY: isReviewCardFlipped ? 180 : 0 }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                  <CardContent className="flex items-center justify-center h-full p-6">
                    <h3 className="text-2xl font-semibold text-center">
                      {currentCard?.question}
                    </h3>
                  </CardContent>
                </Card>
                <Card className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <CardContent className="flex items-center justify-center h-full p-6">
                    <p className="text-xl text-center">{currentCard?.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleDifficultySelection(5)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Easy
                </Button>
                <Button
                  onClick={() => handleDifficultySelection(3)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Medium
                </Button>
                <Button
                  onClick={() => handleDifficultySelection(1)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Hard
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
