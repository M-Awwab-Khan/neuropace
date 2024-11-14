"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { createFlashcardSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateFlashcard } from "@/lib/actions";
import { Flashcard } from "@/lib/types";

interface EditFlashcardProps {
  trigger: React.ReactNode;
  onFlashcardUpdated: (flashcard: Flashcard) => void;
  flashcard: Flashcard;
}

export default function EditFlashcard({
  trigger,
  onFlashcardUpdated,
  flashcard,
}: EditFlashcardProps) {
  const [open, setIsOpen] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<z.infer<typeof createFlashcardSchema>>({
    resolver: zodResolver(createFlashcardSchema),
    defaultValues: {
      question: flashcard.question,
      answer: flashcard.answer,
      deckId: flashcard.deckId,
    },
    mode: "onBlur",
  });

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof createFlashcardSchema>) => {
    const updatedFlashcard = await updateFlashcard(flashcard.id, data);
    onFlashcardUpdated(updatedFlashcard as Flashcard);
    setIsOpen(false);
    reset();
  };
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Flashcard</DialogTitle>
            <DialogDescription>
              Edit the question and answer of the flashcard.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="question">Question</Label>
              <Input id="question" type="text" {...register("question")} />
              {errors.question && (
                <span className="col-span-3 text-red-500 text-sm">
                  {errors?.question?.message?.toString()}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Input id="answer" type="text" {...register("answer")} />
              {errors.answer && (
                <span className="col-span-3 text-red-500 text-sm">
                  {errors?.answer?.message?.toString()}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
