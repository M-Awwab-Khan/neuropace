"use client";
import { useRef, useState } from "react";
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
import { Switch } from "../ui/switch";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

interface CreateDeckProps {
  trigger: React.ReactNode;
  onDeckCreated: (deck: any) => void;
  userId: string;
}

export default function CreateDeck({
  trigger,
  onDeckCreated,
  userId,
}: CreateDeckProps) {
  const visibilityRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
    reset,
    setValue,
  } = useForm<z.infer<typeof createDeckSchema>>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      name: "",
      category: "",
      userId: userId,
    },
  });
  const { toast } = useToast();
  const [open, setIsOpen] = useState(false);

  const isLoading = formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof createDeckSchema>) => {
    const createdDeck = await createDeck({
      ...data,
      visibility: (visibilityRef.current as any).ariaChecked
        ? "public"
        : "private",
    });
    onDeckCreated(createdDeck);
    reset();
    setIsOpen(false);
    toast({
      title: "Deck created",
      description: "Your deck has been created successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="private" className="text-right">
              Public
            </Label>
            <Switch ref={visibilityRef} id="private" className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
