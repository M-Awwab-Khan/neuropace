"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDeckSchema } from "@/lib/schema";
import { createDeck } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

interface CreateDeckProps {
  trigger: React.ReactNode;
  onDeckCreated: (deck: any) => void;
}

export default function CreateDeck({
  trigger,
  onDeckCreated,
}: CreateDeckProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
    reset,
  } = useForm<z.infer<typeof createDeckSchema>>({
    resolver: zodResolver(createDeckSchema),
  });

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof createDeckSchema>) => {
    const createddeck = await createDeck(data);
    onDeckCreated(createddeck);
    reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create Deck</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new deck.
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
                  {errors.name.message?.toString()}
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
                  {errors.category.message?.toString()}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
