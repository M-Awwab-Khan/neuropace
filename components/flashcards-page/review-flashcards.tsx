"use client";

import { useState } from "react";
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

interface FlashcardReviewProps {
  flashcards: Flashcard[];
  trigger: React.ReactNode;
}

export default function FlashcardReview({
  flashcards,
  trigger,
}: FlashcardReviewProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<number[]>([]);
  const [direction, setDirection] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentReviewCardIndex, setCurrentReviewCardIndex] = useState(0);
  const [isReviewCardFlipped, setIsReviewCardFlipped] = useState(false);
  const [reviewDirection, setReviewDirection] = useState(0);
  const currentReviewCard = flashcards[currentReviewCardIndex];
  const reviewProgress = (reviewedCards.length / flashcards.length) * 100;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficultySelection = (difficulty: string) => {
    console.log(`Card ${currentCardIndex} marked as ${difficulty}`);
    setReviewedCards([...reviewedCards, currentCardIndex]);
    goToNextCard();
  };

  const goToNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setDirection(1);
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handleReviewFlip = () => {
    setIsReviewCardFlipped(!isReviewCardFlipped);
  };

  const goToNextReviewCard = () => {
    if (currentReviewCardIndex < flashcards.length - 1) {
      setReviewDirection(1);
      setCurrentReviewCardIndex(currentReviewCardIndex + 1);
      setIsReviewCardFlipped(false);
    } else {
      setIsReviewModalOpen(false);
      setCurrentReviewCardIndex(0);
      setReviewedCards([]);
    }
  };

  const goToPreviousReviewCard = () => {
    if (currentReviewCardIndex > 0) {
      setReviewDirection(-1);
      setCurrentReviewCardIndex(currentReviewCardIndex - 1);
      setIsReviewCardFlipped(false);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setDirection(-1);
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const currentCard = flashcards[currentCardIndex];
  const isReviewComplete = reviewedCards.length === flashcards.length;
  const progress = (reviewedCards.length / flashcards.length) * 100;

  return (
    <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
      <DialogTrigger asChild>
        {/* <Button className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4" /> Review Flashcards
        </Button> */}
        {trigger}
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
              {reviewedCards.length} of {flashcards.length} cards reviewed
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReviewCardIndex}
                initial={{ opacity: 0, x: reviewDirection > 0 ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reviewDirection > 0 ? -100 : 100 }}
                transition={{ duration: 0.3 }}
                className="relative w-full aspect-[3/2]"
              >
                <motion.div
                  className="absolute inset-0 w-full h-full cursor-pointer"
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
                        {currentReviewCard.question}
                      </h3>
                    </CardContent>
                  </Card>
                  <Card className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <CardContent className="flex items-center justify-center h-full p-6">
                      <p className="text-xl text-center">
                        {currentReviewCard.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={goToPreviousReviewCard}
                disabled={currentReviewCardIndex === 0}
              >
                Previous
              </Button>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleDifficultySelection("easy")}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Easy
                </Button>
                <Button
                  onClick={() => handleDifficultySelection("medium")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  Medium
                </Button>
                <Button
                  onClick={() => handleDifficultySelection("hard")}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Hard
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={goToNextReviewCard}
                disabled={currentReviewCardIndex === flashcards.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
