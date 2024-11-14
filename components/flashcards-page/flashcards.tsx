"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getFlashcards } from "@/lib/actions";
import CreateFlashcard from "./create-flashcard";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export default function Flashcards({
  userId,
  deckId,
}: {
  userId: string;
  deckId: string;
}) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [newCard, setNewCard] = useState<Omit<Flashcard, "id">>({
    question: "",
    answer: "",
  });

  useEffect(() => {
    const fetchFlashcards = async () => {
      const flashcards = await getFlashcards(deckId);
      setFlashcards(flashcards);
    };
    fetchFlashcards();
  }, []);

  const handleFlip = (id: number) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const handleEdit = (card: Flashcard) => {
    setEditingCard(card);
  };

  const handleDelete = (id: number) => {
    setFlashcards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleSaveEdit = () => {
    if (editingCard) {
      setFlashcards((prev) =>
        prev.map((card) => (card.id === editingCard.id ? editingCard : card))
      );
      setEditingCard(null);
    }
  };

  const handleCreateCard = (newCard) => {
    setFlashcards((prev) => [...prev, { ...newCard }]);
    setNewCard({ question: "", answer: "" });
  };

  return (
    <div className="container mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flashcards</h1>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(card);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Flashcard</DialogTitle>
                        <DialogDescription>
                          Make changes to your flashcard here. Click save when
                          you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-question" className="text-right">
                            Question
                          </Label>
                          <Input
                            id="edit-question"
                            value={editingCard?.question || ""}
                            onChange={(e) =>
                              setEditingCard((prev) =>
                                prev
                                  ? { ...prev, question: e.target.value }
                                  : null
                              )
                            }
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-answer" className="text-right">
                            Answer
                          </Label>
                          <Input
                            id="edit-answer"
                            value={editingCard?.answer || ""}
                            onChange={(e) =>
                              setEditingCard((prev) =>
                                prev
                                  ? { ...prev, answer: e.target.value }
                                  : null
                              )
                            }
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleSaveEdit}>
                          Save changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your flashcard.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(card.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="absolute inset-0 w-full h-full bg-primary rounded-lg shadow-lg p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <p className="text-lg text-primary-foreground">{card.answer}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
