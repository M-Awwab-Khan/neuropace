import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createFlashcard } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Flashcard } from "@/lib/types";
import { Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFlashcardSchema } from "@/lib/schema";
import { z } from "zod";

interface CreateFlashcardProps {
  deckId: string;
  onFlashcardCreated: (flashcard: Flashcard) => void;
  trigger: React.ReactNode;
}
export default function CreateFlashcard({
  deckId,
  onFlashcardCreated,
  trigger,
}: CreateFlashcardProps) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof createFlashcardSchema>>({
    resolver: zodResolver(createFlashcardSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });
  const [open, setIsOpen] = useState(false);
  const isLoading = formState.isSubmitting;
  const onSubmit = async (data: z.infer<typeof createFlashcardSchema>) => {
    const createdFlashcard = (await createFlashcard(deckId, data)) as Flashcard;
    onFlashcardCreated(createdFlashcard);
    reset();
    setIsOpen(false);
    toast({
      title: "Flashcard created",
      description: "Your flashcard has been created successfully.",
    });
  };
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* <Button className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Create Flashcard
        </Button> */}
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Flashcard</DialogTitle>
            <DialogDescription>
              Add a new question and answer to your flashcard deck.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="question" className="text-right">
                Question
              </Label>
              <Input
                id="question"
                {...register("question")}
                className="col-span-3"
              />
              {errors.question && (
                <span className="col-span-3 text-red-500 text-sm">
                  {errors?.question?.message?.toString()}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="answer" className="text-right">
                Answer
              </Label>
              <Input
                id="answer"
                className="col-span-3"
                {...register("answer")}
              />
              {errors.answer && (
                <span className="col-span-3 text-red-500 text-sm">
                  {errors?.answer?.message?.toString()}
                </span>
              )}
            </div>
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
