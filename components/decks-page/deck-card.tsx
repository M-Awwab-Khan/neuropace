import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit2, Trash2, CalendarClock } from "lucide-react";
import EditDeck from "./edit-deck";
import DeleteDeck from "./delete-deck";
import Link from "next/link";

interface DeckCardProps {
  id: string;
  userId: string;
  name: string;
  category: string;
  progress: number;
  onDeckUpdated: (deck: any) => void;
  onDeckDeleted: (deckId: string) => void;
}

export function DeckCard({
  id,
  userId,
  name,
  category,
  progress,
  onDeckUpdated,
  onDeckDeleted,
}: DeckCardProps) {
  return (
    <Card className="w-[350px] hover:shadow-lg transition-shadow duration-200">
      <Link href={`/my-decks/${id}`}>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{category}</CardDescription>
        </CardHeader>
      </Link>
      <div className="flex flex-row gap-2 pl-6 text-sm text-muted-foreground">
        <CalendarClock className="h-5 w-5" />
        12/12/2021
      </div>
      <CardFooter className="flex flex-col items-end">
        <EditDeck
          trigger={
            <Button variant="ghost">
              <Edit2 className="h-5 w-5" />
            </Button>
          }
          onDeckUpdated={onDeckUpdated}
          deck={{ id, userId, name, category }}
        />

        <DeleteDeck
          trigger={
            <Button variant="ghost">
              <Trash2 className="h-5 w-5" />
            </Button>
          }
          onDeckDeleted={onDeckDeleted}
          deck={{ id, userId, name, category }}
        />
      </CardFooter>
      <Progress value={progress} />
    </Card>
  );
}
