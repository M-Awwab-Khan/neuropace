import { useState } from "react";
import { deleteFlashcard } from "@/lib/actions";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Flashcard } from "@/lib/types";

interface DeleteFlashcardProps {
  trigger: React.ReactNode;
  onFlashcardDelete: (id: string) => void;
  flashcard: Flashcard;
}

export default function DeleteFlashcard({
  trigger,
  onFlashcardDelete,
  flashcard,
}: DeleteFlashcardProps) {
  const onDelete = async (id: string) => {
    setDeletingDeck(true);
    await deleteFlashcard(id);
    onFlashcardDelete(id);
    setDeletingDeck(false);
  };

  const [deletingDeck, setDeletingDeck] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            flashcard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => onDelete(flashcard.id)}
            disabled={deletingDeck}
          >
            {deletingDeck ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
