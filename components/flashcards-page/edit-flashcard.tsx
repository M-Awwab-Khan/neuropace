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
import { updateCompleteFlashcard } from "@/lib/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
      userId: flashcard.userId,
      nextReviewDate: new Date().toISOString(),
    },
  });
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  const isLoading = formState.isSubmitting;

  const handleFormSubmit = async (
    data: z.infer<typeof createFlashcardSchema>
  ) => {
    if (
      data.question !== flashcard.question ||
      data.answer !== flashcard.answer
    ) {
      setShowScheduleDialog(true);
      setPendingFormData(data);
      return;
    }
    setIsOpen(false);
    reset();
  };

  const handleKeepSchedule = async () => {
    if (!pendingFormData) return;

    const updatedFlashcard = await updateFlashcard(
      flashcard.id as string,
      pendingFormData
    );
    onFlashcardUpdated(updatedFlashcard as Flashcard);
    setShowScheduleDialog(false);
    setIsOpen(false);
    reset();
  };

  const handleResetSchedule = async () => {
    if (!pendingFormData) return;

    const updatedFlashcard = {
      ...pendingFormData,
      id: flashcard.id,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReviewDate: new Date().toISOString(),
    };

    await updateCompleteFlashcard(updatedFlashcard);
    onFlashcardUpdated(updatedFlashcard);
    setShowScheduleDialog(false);
    setIsOpen(false);
    reset();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
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
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Review Schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              The flashcard content has changed. Would you like to reset the
              review schedule for this card?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleKeepSchedule}>
              Keep Previous Schedule
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResetSchedule}>
              Reset Schedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
