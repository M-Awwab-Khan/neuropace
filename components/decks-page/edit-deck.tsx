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
import { createDeckSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDeck } from "@/lib/actions";
import { Deck } from "@/lib/types";

interface EditDeckProps {
  trigger: React.ReactNode;
  onDeckUpdated: (deck: Deck) => void;
  deck: Deck;
}

export default function EditDeck({
  trigger,
  onDeckUpdated,
  deck,
}: EditDeckProps) {
  const [open, setIsOpen] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<z.infer<typeof createDeckSchema>>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      name: deck.name,
      category: deck.category,
    },
    mode: "onBlur",
  });

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof createDeckSchema>) => {
    const updatedDeck = await updateDeck(deck.id, data);
    onDeckUpdated(updatedDeck as Deck);
    setIsOpen(false);
    reset();
  };
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
            <DialogDescription>
              Edit the details below to update the deck.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" {...register("name")} className="col-span-3" />
              {errors.name && (
                <p className="col-span-4 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                {...register("category")}
                className="col-span-3"
              />
              {errors.category && (
                <p className="col-span-4 text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
