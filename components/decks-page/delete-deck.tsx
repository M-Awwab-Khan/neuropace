"use client";
import { deleteDeck } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Deck } from "@/lib/types";

export default function DeleteDeck({
  trigger,
  onDeckDeleted,
  deck,
}: {
  trigger: React.ReactNode;
  onDeckDeleted: (deckId: string) => void;
  deck: Deck;
}) {
  const [deletingDeck, setDeletingDeck] = useState(false);
  const [open, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setDeletingDeck(true);
    await deleteDeck(deck.id);
    onDeckDeleted(deck.id);
    setDeletingDeck(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this deck?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeletingDeck(false)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={handleDelete}
            disabled={deletingDeck}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
